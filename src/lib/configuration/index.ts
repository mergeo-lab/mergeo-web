import { ApiResponse, Response } from '@/types';
import { configurationEndpoints } from './endpoints';
import { axiosPrivate } from '@/lib/api/axios';
import { CompanySchemaType } from '@/lib/configuration/schema';

export async function getCompany(): Promise<Response<CompanySchemaType>> {
  let errorMessage: string = '';
  try {
    const response: ApiResponse<CompanySchemaType> = await axiosPrivate.get(
      configurationEndpoints.COMPANY
    );
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.response) {
      errorMessage = 'Algo salio mal, vuelve a intentarlo!';
    } else {
      errorMessage = error.response?.data.message;
    }
    return errorMessage;
  }
}

export async function updateCompany(
  fields: CompanySchemaType
): Promise<Response<CompanySchemaType>> {
  let errorMessage: string = '';
  try {
    const response: ApiResponse<CompanySchemaType> = await axiosPrivate.patch(
      configurationEndpoints.COMPANY,
      JSON.stringify({ ...fields }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.response) {
      errorMessage = 'Algo salio mal, vuelve a intentarlo!';
    } else {
      errorMessage = error.response?.data.message;
    }
    return errorMessage;
  }
}
