import { configurationEndpoints } from '@/lib/configuration/endpoints/config';

export const DROP_ZONE = (companyId: string): string => {
  return `${configurationEndpoints.COMPANY}/${companyId}${configurationEndpoints.DROP_ZONE}`;
};

export const EDIT_DROP_ZONE = (id: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.DROP_ZONE}/${id}`;
};

export const DELETE_DROP_ZONE = (id: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.DROP_ZONE}/${id}`;
};
