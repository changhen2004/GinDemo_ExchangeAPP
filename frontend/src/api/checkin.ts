import apiClient, { unwrapData } from './client';

export interface CheckInResponse {
  message: string;
  awardedPoints: number;
  balance: number;
}

export function checkIn() {
  return unwrapData<CheckInResponse>(apiClient.post('/me/check-in'));
}
