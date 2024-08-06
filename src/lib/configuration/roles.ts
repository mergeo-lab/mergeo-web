import { axiosPrivate } from '@/lib/api/axios';
import { PermissionSchemaType } from '@/lib/configuration/schema';
import { isAxiosError } from 'axios';
import { Response } from '@/types';
import { configurationEndpoints } from '@/lib/configuration/endpoints';

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

export async function roleDelete({
  roleId,
}: {
  roleId: string;
}): Promise<Response<string>> {
  try {
    const response: Response<string> = await axiosPrivate.delete(
      `${configurationEndpoints.ROLE}/${roleId}`,
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
