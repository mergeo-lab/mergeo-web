/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, ErrorMessage } from '@/types';

export function isApiResponse<T>(response: any): response is Response<T> {
  return (
    response && response.hasOwnProperty('data') && typeof response !== 'string'
  );
}

export function isErrorMessage(response: any): response is ErrorMessage {
  return (
    typeof response === 'string' ||
    (Array.isArray(response) &&
      response.every((item) => typeof item === 'string'))
  );
}
