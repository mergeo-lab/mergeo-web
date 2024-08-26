import { axiosPrivate } from '@/lib/api/axios';
import { addUserEndpoint } from '@/lib/auth/endpoints';
import { configurationEndpoints } from '@/lib/configuration/endpoints';
import {
  NewUserSchemaType,
  PermissionSchemaType,
  RoleSchemaType,
  UserSchemaResponseType,
  UserSchemaType,
} from '@/lib/configuration/schemas';
import { Response } from '@/types';
import { AxiosResponse, isAxiosError } from 'axios';

export async function getUsers(
  compnayId: string
): Promise<Response<UserSchemaResponseType>> {
  try {
    const response: Response<UserSchemaResponseType> = await axiosPrivate.get(
      configurationEndpoints.USERS,
      {
        params: { id: compnayId },
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

export async function addUser({
  id,
  companyId,
  fields,
}: {
  id: string;
  companyId: string;
  fields: NewUserSchemaType;
}): Promise<Response<UserSchemaType>> {
  try {
    const response: Response<UserSchemaType> = await axiosPrivate.post(
      addUserEndpoint(id),
      JSON.stringify({ ...fields, companyId: companyId }),
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

export async function editUser({
  id,
  fields,
}: {
  id: string;
  fields: NewUserSchemaType;
}): Promise<Response<UserSchemaType>> {
  try {
    const response: Response<UserSchemaType> = await axiosPrivate.patch(
      `${configurationEndpoints.USERS}/${id}`,
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

export async function deleteUser({
  id,
}: {
  id: string;
}): Promise<Response<UserSchemaType>> {
  try {
    const response: Response<UserSchemaType> = await axiosPrivate.delete(
      `${configurationEndpoints.USERS}/${id}`,
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

export async function getPermissions(): Promise<
  Response<PermissionSchemaType[]>
> {
  try {
    const { data: response }: AxiosResponse<Response<PermissionSchemaType[]>> =
      await axiosPrivate.get(`${configurationEndpoints.PERMISSIONS}`);
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message || errorMessage;
    }
    return { error: errorMessage };
  }
}

export async function getAllRoles(
  compnayId: string
): Promise<Response<{ roles: RoleSchemaType[] }>> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${configurationEndpoints.ALL_ROLES}/${compnayId}`
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
