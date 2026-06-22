import axios from 'axios';
import { Train, Platform, AuditLog, AIRecommendation, ChatMessage } from '../types';

const API_BASE_URL = typeof window !== 'undefined'
  ? (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname.startsWith('172.16.') || 
     window.location.hostname.startsWith('192.168.') || 
     window.location.hostname.startsWith('10.')
     ? `http://${window.location.hostname}:8000`
     : '')
  : 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to auth-header
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Initial mock data for offline fallback
let mockTrains: Train[] = [
  { train_number: '12123', train_name: 'Deccan Express', platform: 2, scheduled_time: '14:30', delay_minutes: 0, status: 'ON_TIME' },
  { train_number: '12952', train_name: 'Rajdhani Express', platform: 3, scheduled_time: '14:45', delay_minutes: 0, status: 'ON_TIME' },
  { train_number: '12043', train_name: 'Shatabdi Express', platform: 4, scheduled_time: '15:00', delay_minutes: 0, status: 'ON_TIME' },
  { train_number: '11077', train_name: 'Jhelum Express', platform: 1, scheduled_time: '15:15', delay_minutes: 0, status: 'ON_TIME' },
  { train_number: '12261', train_name: 'Duronto Express', platform: 6, scheduled_time: '15:30', delay_minutes: 0, status: 'ON_TIME' },
  { train_number: '12925', train_name: 'Paschim Express', platform: 5, scheduled_time: '16:00', delay_minutes: 0, status: 'ON_TIME' },
  { train_number: '12626', train_name: 'Kerala Express', platform: 7, scheduled_time: '16:15', delay_minutes: 0, status: 'ON_TIME' },
  { train_number: '12301', train_name: 'Howrah Duronto', platform: 8, scheduled_time: '16:40', delay_minutes: 0, status: 'ON_TIME' },
];

let mockPlatforms: Platform[] = [
  { platform_number: 1, occupancy_status: 'OCCUPIED', assigned_train_number: '11077', crowd_status: 'LOW' },
  { platform_number: 2, occupancy_status: 'OCCUPIED', assigned_train_number: '12123', crowd_status: 'MEDIUM' },
  { platform_number: 3, occupancy_status: 'OCCUPIED', assigned_train_number: '12952', crowd_status: 'LOW' },
  { platform_number: 4, occupancy_status: 'OCCUPIED', assigned_train_number: '12043', crowd_status: 'LOW' },
  { platform_number: 5, occupancy_status: 'VACANT', assigned_train_number: null, crowd_status: 'LOW' },
  { platform_number: 6, occupancy_status: 'OCCUPIED', assigned_train_number: '12261', crowd_status: 'LOW' },
  { platform_number: 7, occupancy_status: 'OCCUPIED', assigned_train_number: '12626', crowd_status: 'LOW' },
  { platform_number: 8, occupancy_status: 'OCCUPIED', assigned_train_number: '12301', crowd_status: 'LOW' },
];

let mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    timestamp: '2026-06-15 01:20:10',
    event_type: 'System Startup',
    description: 'RailSaarthi Operational Intelligence initialized for New Delhi (NDLS) command room.',
    recommended_action: null,
    status: 'APPROVED',
    operator_name: 'SYSTEM',
    recovery_time_saved: '0 mins',
  },
];

// Helper to check backend availability
let isBackendOffline = false;

export const setBackendOffline = (offline: boolean) => {
  isBackendOffline = offline;
};

export const trainService = {
  getTrains: async (): Promise<Train[]> => {
    if (isBackendOffline) return mockTrains;
    try {
      const response = await api.get<Train[]>('/trains');
      return response.data;
    } catch (error) {
      console.warn('Backend offline, falling back to mock data', error);
      isBackendOffline = true;
      return mockTrains;
    }
  },
};

export const platformService = {
  getPlatforms: async (): Promise<Platform[]> => {
    if (isBackendOffline) return mockPlatforms;
    try {
      const response = await api.get<Platform[]>('/platforms');
      return response.data;
    } catch (error) {
      isBackendOffline = true;
      return mockPlatforms;
    }
  },
};

export const auditLogService = {
  getLogs: async (): Promise<AuditLog[]> => {
    if (isBackendOffline) return mockAuditLogs;
    try {
      const response = await api.get<AuditLog[]>('/audit-logs');
      return response.data;
    } catch (error) {
      isBackendOffline = true;
      return mockAuditLogs;
    }
  },
  respondToRecommendation: async (id: number, approved: boolean): Promise<AuditLog> => {
    if (isBackendOffline) {
      const log = mockAuditLogs.find((l) => l.id === id);
      if (log) {
        log.status = approved ? 'APPROVED' : 'REJECTED';
        if (approved && log.recommended_action) {
          const action = log.recommended_action;
          // Apply changes to mock state
          const train = mockTrains.find(t => t.train_number === action.move_train);
          if (train) {
            // Update old platform to be vacant
            const oldPlat = mockPlatforms.find(p => p.platform_number === action.old_platform);
            if (oldPlat && oldPlat.assigned_train_number === action.move_train) {
              oldPlat.assigned_train_number = null;
              oldPlat.occupancy_status = 'VACANT';
            }
            // Update new platform to occupied
            const newPlat = mockPlatforms.find(p => p.platform_number === action.new_platform);
            if (newPlat) {
              // If there was a train there, move it or set to vacant? Let's assume it was vacant
              newPlat.assigned_train_number = action.move_train;
              newPlat.occupancy_status = 'OCCUPIED';
            }
            train.platform = action.new_platform;
            train.status = 'WARNING'; // downgraded delay severity by platform management
          }
        }
        return log;
      }
      throw new Error('Log not found');
    }
    const response = await api.post<AuditLog>(`/audit-logs/${id}/action`, { approved });
    return response.data;
  },
};

export const simulationService = {
  simulateDelay: async (trainNumber: string, delayMinutes: number): Promise<{ recommendation: AIRecommendation; log_id: number }> => {
    if (isBackendOffline) {
      // Simulate delay in mock data
      const train = mockTrains.find((t) => t.train_number === trainNumber);
      if (train) {
        train.delay_minutes = delayMinutes;
        train.status = delayMinutes > 30 ? 'DELAYED' : 'WARNING';
      }

      // Identify affected downstream trains
      const affectedTrains = mockTrains
        .filter((t) => t.train_number !== trainNumber && t.platform === 2)
        .map((t) => `${t.train_number} ${t.train_name}`);

      // Auto platform swap recommendation
      const oldPlatform = 2;
      const newPlatform = 5;

      const recommendation: AIRecommendation = {
        event_type: 'delay',
        affected_trains: affectedTrains.length > 0 ? affectedTrains : ['12952 Rajdhani Express'],
        recommended_action: {
          move_train: trainNumber,
          old_platform: oldPlatform,
          new_platform: newPlatform,
        },
        crowd_risk: 'HIGH',
        announcement: `May I have your attention please. Train ${trainNumber}, ${train?.train_name || 'Deccan Express'}, scheduled to arrive on Platform ${oldPlatform}, is running delayed by ${delayMinutes} minutes. It will now arrive on Platform ${newPlatform} instead of Platform ${oldPlatform}. The inconvenience caused is deeply regretted.`,
        confidence: '94%',
        estimated_recovery: '11 mins',
      };

      const newLog: AuditLog = {
        id: mockAuditLogs.length + 1,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        event_type: 'Delay Event',
        description: `Train ${trainNumber} (${train?.train_name}) delayed by ${delayMinutes} mins. Downstream conflict on Platform ${oldPlatform}.`,
        recommended_action: recommendation.recommended_action,
        status: 'PENDING',
        operator_name: 'SM R. K. Sharma',
        recovery_time_saved: '11 mins',
      };

      mockAuditLogs.unshift(newLog);

      return { recommendation, log_id: newLog.id };
    }

    try {
      const response = await api.post<{ recommendation: AIRecommendation; log_id: number }>('/simulate-delay', {
        train_number: trainNumber,
        delay_minutes: delayMinutes,
      });
      return response.data;
    } catch (error) {
      isBackendOffline = true;
      return simulationService.simulateDelay(trainNumber, delayMinutes);
    }
  },

  simulateCascade: async (): Promise<{ recommendation: AIRecommendation; log_id: number }> => {
    if (isBackendOffline) {
      // Simulate cascade delays
      mockTrains.forEach((t) => {
        if (t.train_number === '12123') {
          t.delay_minutes = 60;
          t.status = 'DELAYED';
        } else if (t.train_number === '12952') {
          t.delay_minutes = 25;
          t.status = 'WARNING';
        } else if (t.train_number === '12043') {
          t.delay_minutes = 15;
          t.status = 'WARNING';
        }
      });

      const recommendation: AIRecommendation = {
        event_type: 'cascade_delay',
        affected_trains: ['12952 Rajdhani Express', '12043 Shatabdi Express'],
        recommended_action: {
          move_train: '12123',
          old_platform: 2,
          new_platform: 5,
        },
        crowd_risk: 'HIGH',
        announcement: 'May I have your attention please. Train 12123, Deccan Express, is delayed by 60 minutes. Connecting trains 12952 Rajdhani Express and 12043 Shatabdi Express are now rescheduled. Train 12123 will arrive on Platform 5 instead of Platform 2.',
        confidence: '89%',
        estimated_recovery: '18 mins',
      };

      const newLog: AuditLog = {
        id: mockAuditLogs.length + 1,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        event_type: 'Cascading Delays',
        description: 'Primary delay of Deccan Express (12123) triggered secondary cascading delays on Rajdhani Express and Shatabdi Express.',
        recommended_action: recommendation.recommended_action,
        status: 'PENDING',
        operator_name: 'SM R. K. Sharma',
        recovery_time_saved: '18 mins',
      };

      mockAuditLogs.unshift(newLog);

      return { recommendation, log_id: newLog.id };
    }

    try {
      const response = await api.post<{ recommendation: AIRecommendation; log_id: number }>('/simulate-cascade');
      return response.data;
    } catch (error) {
      isBackendOffline = true;
      return simulationService.simulateCascade();
    }
  },

  simulateCrowd: async (): Promise<{ recommendation: AIRecommendation; log_id: number }> => {
    if (isBackendOffline) {
      const platform3 = mockPlatforms.find(p => p.platform_number === 3);
      if (platform3) {
        platform3.crowd_status = 'HIGH';
      }

      const recommendation: AIRecommendation = {
        event_type: 'crowd_surge',
        affected_trains: ['12952 Rajdhani Express'],
        recommended_action: {
          move_train: '12952',
          old_platform: 3,
          new_platform: 5,
        },
        crowd_risk: 'HIGH',
        announcement: 'Attention passengers on Platform 3. Due to platform congestion, Train 12952 Rajdhani Express will now arrive on Platform 5. Please use the central overhead bridge to proceed to Platform 5 safely.',
        confidence: '92%',
        estimated_recovery: '6 mins',
      };

      const newLog: AuditLog = {
        id: mockAuditLogs.length + 1,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        event_type: 'Crowd Emergency',
        description: 'Crowd surge detected on Platform 3. Recommendation: swap Rajdhani Express to Platform 5 to avoid choke-points.',
        recommended_action: recommendation.recommended_action,
        status: 'PENDING',
        operator_name: 'SM R. K. Sharma',
        recovery_time_saved: '6 mins',
      };

      mockAuditLogs.unshift(newLog);

      return { recommendation, log_id: newLog.id };
    }

    try {
      const response = await api.post<{ recommendation: AIRecommendation; log_id: number }>('/simulate-crowd');
      return response.data;
    } catch (error) {
      isBackendOffline = true;
      return simulationService.simulateCrowd();
    }
  },

  simulateEmergency: async (): Promise<{ recommendation: AIRecommendation; log_id: number }> => {
    if (isBackendOffline) {
      const platform3 = mockPlatforms.find(p => p.platform_number === 3);
      if (platform3) {
        platform3.occupancy_status = 'BLOCKED';
      }

      const recommendation: AIRecommendation = {
        event_type: 'medical_emergency',
        affected_trains: ['12952 Rajdhani Express'],
        recommended_action: {
          move_train: '12952',
          old_platform: 3,
          new_platform: 5,
        },
        crowd_risk: 'HIGH',
        announcement: 'Operational Alert: Platform 3 is temporarily closed for emergency medical services. Passengers are requested not to gather near the area. Train 12952, Rajdhani Express, is reassigned to Platform 5.',
        confidence: '98%',
        estimated_recovery: '14 mins',
      };

      const newLog: AuditLog = {
        id: mockAuditLogs.length + 1,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        event_type: 'Medical Emergency',
        description: 'Passenger cardiac arrest reported on Platform 3. Platform blocked for medical responders. Rajdhani Express rerouted to Platform 5.',
        recommended_action: recommendation.recommended_action,
        status: 'PENDING',
        operator_name: 'SM R. K. Sharma',
        recovery_time_saved: '14 mins',
      };

      mockAuditLogs.unshift(newLog);

      return { recommendation, log_id: newLog.id };
    }

    try {
      const response = await api.post<{ recommendation: AIRecommendation; log_id: number }>('/simulate-emergency');
      return response.data;
    } catch (error) {
      isBackendOffline = true;
      return simulationService.simulateEmergency();
    }
  },
};

export const chatService = {
  sendQuery: async (message: string): Promise<string> => {
    if (isBackendOffline) {
      // Local rules based engine responses
      const msg = message.toLowerCase();
      if (msg.includes('fainted') || msg.includes('medical') || msg.includes('heart')) {
        return `**[AI Operational Directive - Medical Emergency]**\n\n1. **Staff Deployment**: Alerting RPF (Railway Protection Force) and the on-duty medical officer to proceed to Platform 3 immediately with a stretcher and emergency kit.\n2. **Crowd Routing**: Directing platform staff to clear a 10-meter perimeter around the passenger to allow air flow.\n3. **Rerouting Directive**: Move incoming Train 12952 (Rajdhani Express) to Platform 5 instead of Platform 3 to prevent congestion.`;
      }
      if (msg.includes('smoke') || msg.includes('fire')) {
        return `**[AI Command Alert - FIRE / SMOKE DETECTED]**\n\n1. **Emergency Call**: Dispatching fire emergency services and initiating local hydrant systems near Track 2.\n2. **Train Control**: Instructing signaling room to hold Jhelum Express (11077) at home signal. Diverting all incoming traffic from tracks 2 and 3.\n3. **Evacuation protocol**: Commencing public announcements to evacuate Platform 2 and 3 using overhead bridges towards Exit Gate 1.`;
      }
      if (msg.includes('surge') || msg.includes('crowd') || msg.includes('congestion')) {
        return `**[AI Tactical Plan - CROWD SURGE RISK]**\n\n1. **Access Controls**: Close platform escalators and ticketing gates for Platform 5 temporarily to throttle inflow.\n2. **Staff Alert**: Deploying 8 additional RPF personnel to manage passenger flow lines at stairwells.\n3. **Announcement**: Broadside multilingual audio alerts requesting passengers to distribute evenly across the platform length.`;
      }
      return `**[AI Assistant Response]**\n\nReceived operation request: "${message}".\n\n*Operational Checklist:*\n- Operational logs reviewed.\n- System monitoring healthy.\n- Recommended course of action: Alert platform staff and monitor telemetry parameters. Please verify if track obstruction is present.`;
    }

    try {
      const response = await api.post<{ response: string }>('/emergency-chat', { message });
      return response.data.response;
    } catch (error) {
      isBackendOffline = true;
      return chatService.sendQuery(message);
    }
  },
};
export default api;
