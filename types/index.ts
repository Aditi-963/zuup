export interface Train {
  train_number: string;
  train_name: string;
  platform: number | null;
  scheduled_time: string;
  delay_minutes: number;
  status: 'ON_TIME' | 'WARNING' | 'DELAYED';
}

export interface Platform {
  platform_number: number;
  occupancy_status: 'VACANT' | 'OCCUPIED' | 'BLOCKED';
  assigned_train_number: string | null;
  crowd_status: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface RecommendedAction {
  move_train: string;
  old_platform: number;
  new_platform: number;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  event_type: string;
  description: string;
  recommended_action: RecommendedAction | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  operator_name: string;
  recovery_time_saved: string;
}

export interface AIRecommendation {
  event_type: string;
  affected_trains: string[];
  recommended_action: RecommendedAction;
  crowd_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  announcement: string;
  confidence: string;
  estimated_recovery: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendations?: string[];
}
