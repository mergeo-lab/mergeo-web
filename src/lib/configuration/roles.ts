import { axiosPrivate } from '@/lib/api/axios';
import { isAxiosError } from 'axios';
import { Response } from '@/types';
import { configurationEndpoints } from './endpoints';
import { PermissionSchemaType } from '@/lib/configuration/schemas';

export async function newRole({
  name,
  permissions,
  companyId,
}: {
  name: string;
  permissions: PermissionSchemaType[];
  companyId: string;
}): Promise<Response<string>> {
  try {
    const response: Response<string> = await axiosPrivate.post(
      `${configurationEndpoints.ROLE}/${companyId}`,
      JSON.stringify({ name, permissions }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
    }

    return { error: errorMessage };
  }
}

export async function roleDelete({ id }: { id: string }): Promise<void> {
  try {
    const { data: response } = await axiosPrivate.delete(
      `${configurationEndpoints.ROLE}/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
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

export async function roleUpdate({
  roleId,
  permissions,
}: {
  roleId: string;
  permissions: PermissionSchemaType[];
}): Promise<Response<string>> {
  try {
    const response: Response<string> = await axiosPrivate.patch(
      `${configurationEndpoints.ROLE}/${roleId}`,
      JSON.stringify({ permissions }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
    }

    return { error: errorMessage };
  }
}
