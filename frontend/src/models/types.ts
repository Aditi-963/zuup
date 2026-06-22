export interface Train {
  id: string;
  name: string;
  route: string;
  platform: number;
  status: 'ok' | 'delayed' | 'warning' | 'diverted';
  dept: string;
  delay: number;
}

export interface SwapPlan {
  affected_trains: string[];
  primary_swap: {
    from_platform: number;
    to_platform: number;
    train: string;
    reason: string;
  };
  crowd_alert: 'LOW' | 'MEDIUM' | 'HIGH';
  hindi_announcement: string;
  confidence: 'HIGH' | 'MEDIUM';
  estimated_recovery_mins: number;
}

export interface AuditLogItem {
  id: number;
  timestamp: string;
  type: 'delay_cascade' | 'crowd_alert' | 'multi_cascade';
  train: string;
  accepted_by: string | null;
  outcome: 'ACCEPTED' | 'OVERRIDDEN' | null;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  label: string;
}
