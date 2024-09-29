import { umc } from '@/jsHelper/umc';

const getSessionInfoPath = 'get/session-info';

export interface UmcSessionInfo {
  username: string;
  auth_type: string;
  remaining: number;
}

export interface UmcGetSessionInfoResponse {
  status: number;
  result: UmcSessionInfo;
}

export async function umcGetSessionInfo() : Promise<UmcSessionInfo> {
  const result = await umc<UmcGetSessionInfoResponse>(getSessionInfoPath);
  return result.data.result;
}
