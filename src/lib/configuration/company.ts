import { Response } from '@/types';
import { configurationEndpoints } from './endpoints';
import { axiosPrivate } from '@/lib/api/axios';
import { AxiosResponse, isAxiosError } from 'axios';
import { CompanySchemaType } from '@/lib/configuration/schemas';

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

export async function updateCompany({
  companyId,
  fields,
}: {
  companyId: string;
  fields: Partial<CompanySchemaType>;
}): Promise<{ data: CompanySchemaType }> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.patch(
      `${configurationEndpoints.COMPANY}/${companyId}`,
      JSON.stringify({ ...fields }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        error.message = 'Algo salio mal, vuelve a intentarlo!';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}
