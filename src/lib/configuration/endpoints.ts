export enum configurationEndpoints {
  API_BASE = '/api',
  COMPANY = `${API_BASE}/company`,
  USERS = `${API_BASE}/user`,
  ALL_ROLES = `${API_BASE}/role`,
  ROLE = `${API_BASE}/role`,
  PERMISSIONS = `${API_BASE}/role/permissions`,
  BRANCH = `/branch`,
  PICK_UP = `/pickup`,
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

export const PICK_UP_DELETE = (branchId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.PICK_UP}/${branchId}`;
};

export const PICK_UP_EDIT = (branchId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.PICK_UP}/${branchId}`;
};
