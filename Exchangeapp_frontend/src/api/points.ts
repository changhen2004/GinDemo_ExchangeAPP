import apiClient, { unwrapData } from './client';

export interface PointsPrivilege {
  privilegeKey: string;
  cost: number;
  redeemedAt: string;
}

export interface PointsSummary {
  balance: number;
  privileges: PointsPrivilege[];
}

export interface PointsRecord {
  id: number;
  change: number;
  balanceAfter: number;
  direction: string;
  source: string;
  referenceType: string;
  referenceId: number;
  description: string;
  createdAt: string;
}

export interface UnlockArticleResponse {
  message: string;
  articleId: number;
  deductedPoints: number;
  balance: number;
}

export interface RedeemPrivilegePayload {
  privilegeKey: string;
}

export interface RedeemPrivilegeResponse {
  message: string;
  privilegeKey: string;
  cost: number;
  balance: number;
}

export function getMyPoints() {
  return unwrapData<PointsSummary>(apiClient.get('/me/points'));
}

export function getMyPointsRecords() {
  return unwrapData<PointsRecord[]>(apiClient.get('/me/points/records'));
}

export function unlockArticle(articleId: string | number) {
  return unwrapData<UnlockArticleResponse>(apiClient.post(`/articles/${articleId}/unlock`));
}

export function redeemPrivilege(payload: RedeemPrivilegePayload) {
  return unwrapData<RedeemPrivilegeResponse>(apiClient.post('/me/points/redeem', payload));
}
