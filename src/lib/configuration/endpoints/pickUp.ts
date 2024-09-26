import { configurationEndpoints } from '@/lib/configuration/endpoints/config';

export const PICK_UP = (companyId: string): string => {
  return `${configurationEndpoints.COMPANY}/${companyId}${configurationEndpoints.PICK_UP}`;
};

export const PICK_UP_DELETE = (pickUpPointId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.PICK_UP}/${pickUpPointId}`;
};

export const PICK_UP_EDIT = (pickUpPointId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.PICK_UP}/${pickUpPointId}`;
};
