import { API_BASE } from '@/lib/api/config';

export enum configurationEndpoints {
  COMPANY = `${API_BASE}/company`,
  USERS = `${API_BASE}/user`,
  ALL_ROLES = `${API_BASE}/role`,
  ROLE = `${API_BASE}/role`,
  PERMISSIONS = `${API_BASE}/role/permissions`,
  BRANCH = `/branch`,
  PICK_UP = `/pickUpPoint`,
  DROP_ZONE = `/dropZone`,
}
