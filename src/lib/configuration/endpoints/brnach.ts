import { configurationEndpoints } from '@/lib/configuration/endpoints/config';

export const BRANCH = (companyId: string): string => {
  return `${configurationEndpoints.COMPANY}/${companyId}${configurationEndpoints.BRANCH}`;
};

export const BRANCH_DELETE = (branchId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.BRANCH}/${branchId}`;
};

export const BRANCH_EDIT = (branchId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.BRANCH}/${branchId}`;
};
