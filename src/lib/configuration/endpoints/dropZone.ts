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

// Endpoint para obtener las zonas de un cliente
export const CLIENT_DROP_ZONES = (clientId: string): string => {
  return `${configurationEndpoints.COMPANY}/${clientId}/dropZones`;
};

// Endpoint para obtener las empresas en una zona específica
export const DROP_ZONE_COMPANIES = (dropZoneId: string): string => {
  return `${configurationEndpoints.COMPANY}${configurationEndpoints.DROP_ZONE}/${dropZoneId}/companies`;
};

// Endpoint para obtener todas las zonas disponibles
export const ALL_DROP_ZONES = (companyId: string): string => {
  return `${configurationEndpoints.COMPANY}/${companyId}${configurationEndpoints.DROP_ZONE}`;
};
