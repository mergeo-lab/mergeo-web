import { axiosPrivate } from '@/lib/api/axios';
import { configurationEndpoints } from '@/lib/configuration/endpoints';
import { UserSchemaResponseType } from '@/lib/configuration/schema';
import { Response } from '@/types';
import { isAxiosError } from 'axios';

export async function getUsers(
  compnayId: string
): Promise<Response<UserSchemaResponseType>> {
  try {
    const response: Response<UserSchemaResponseType> = await axiosPrivate.get(
      configurationEndpoints.USERS,
      {
        params: { id: compnayId },
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
