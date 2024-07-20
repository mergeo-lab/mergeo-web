import { Response } from '@/types';
import { configurationEndpoints } from './endpoints';
import { axiosPrivate } from '@/lib/api/axios';
import { CompanySchemaType } from '@/lib/configuration/schema';
import { isAxiosError } from 'axios';

export async function getCompany(): Promise<Response<CompanySchemaType>> {
  try {
    const response: Response<CompanySchemaType> = await axiosPrivate.get(
      configurationEndpoints.COMPANY
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message || errorMessage;
    }

    return { error: errorMessage };
  }
}

export async function updateCompany(
  fields: CompanySchemaType
): Promise<Response<CompanySchemaType>> {
  try {
    const response: Response<CompanySchemaType> = await axiosPrivate.patch(
      configurationEndpoints.COMPANY,
      JSON.stringify({ ...fields }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message || errorMessage;
    }

    return { error: errorMessage };
  }
}
