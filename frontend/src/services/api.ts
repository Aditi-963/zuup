import type { Train, SwapPlan, AuditLogItem } from '../models/types';

const BACKEND_URL =
  window.location.origin.includes('file://') ||
  window.location.origin.includes('null') ||
  window.location.origin.includes('localhost:5173') ||
  window.location.origin.includes('localhost:3000')
    ? 'http://localhost:8000'
    : window.location.origin;

export async function fetchTimetable(): Promise<{ trains: Train[]; station: string; timestamp: string }> {
  const response = await fetch(`${BACKEND_URL}/api/timetable`);
  if (!response.ok) throw new Error('Failed to fetch timetable');
  return response.json();
}

export async function simulateDelay(trainId: string, delayMins: number, location: string = 'En route'): Promise<{ recovery_plan: SwapPlan }> {
  const response = await fetch(`${BACKEND_URL}/api/simulate-delay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ train_id: trainId, delay_mins: delayMins, location }),
  });
  if (!response.ok) throw new Error('Failed to simulate delay');
  return response.json();
}

export async function simulateCrowdAlert(platform: number, capacityPercent: number): Promise<{ plan: string }> {
  const response = await fetch(`${BACKEND_URL}/api/crowd-alert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform, capacity_percent: capacityPercent }),
  });
  if (!response.ok) throw new Error('Failed to simulate crowd alert');
  return response.json();
}

export async function simulateMultiDelay(delays: { train_id: string; delay_mins: number }[]): Promise<{ recovery_plan: { recovery_steps: string[]; crowd_level: string; hindi_announcement: string } }> {
  const response = await fetch(`${BACKEND_URL}/api/simulate-multi-delay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delays }),
  });
  if (!response.ok) throw new Error('Failed to simulate multi delay');
  return response.json();
}

export async function logDecisionAction(decisionId: string, accepted: boolean, overrideReason: string = ''): Promise<{ status: string; outcome: string }> {
  const response = await fetch(`${BACKEND_URL}/api/decision-action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision_id: decisionId, accepted, override_reason: overrideReason }),
  });
  if (!response.ok) throw new Error('Failed to log decision action');
  return response.json();
}

export async function sendChatMessage(message: string, language: string): Promise<{ reply: string }> {
  const response = await fetch(`${BACKEND_URL}/api/emergency-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language }),
  });
  if (!response.ok) throw new Error('Failed to send chat message');
  return response.json();
}

export async function fetchAuditLogs(): Promise<{ decisions: AuditLogItem[] }> {
  const response = await fetch(`${BACKEND_URL}/api/audit-log`);
  if (!response.ok) throw new Error('Failed to fetch audit logs');
  return response.json();
}
