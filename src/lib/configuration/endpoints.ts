export enum configurationEndpoints {
  API_BASE = '/api',
  COMPANY = `${API_BASE}/company`,
  USERS = `${API_BASE}/user`,
  ALL_ROLES = `${API_BASE}/role`,
  ROLE = `${API_BASE}/role`,
  PERMISSIONS = `${API_BASE}/role/permissions`,
  BRANCH = `/branch`,
  PICK_UP = `/pickUpPoint`,
  DROP_ZONE = `/dropZone`,
}

export const BRANCH = (companyId: string): string => {
  return `${configurationEndpoints.COMPANY}/${companyId}${configurationEndpoints.BRANCH}`;
};

export const BRANCH_DELETE = (branchId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.BRANCH}/${branchId}`;
};

export const BRANCH_EDIT = (branchId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.BRANCH}/${branchId}`;
};

export const PICK_UP = (companyId: string): string => {
  return `${configurationEndpoints.COMPANY}/${companyId}${configurationEndpoints.PICK_UP}`;
};

export const PICK_UP_DELETE = (pickUpPointId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.PICK_UP}/${pickUpPointId}`;
};

export const PICK_UP_EDIT = (pickUpPointId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.PICK_UP}/${pickUpPointId}`;
};

export const DROP_ZONE = (companyId: string): string => {
  return `${configurationEndpoints.COMPANY}/${companyId}${configurationEndpoints.DROP_ZONE}`;
};

export const EDIT_DROP_ZONE = (id: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.DROP_ZONE}/${id}`;
};

export const DELETE_DROP_ZONE = (id: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.DROP_ZONE}/${id}`;
};
