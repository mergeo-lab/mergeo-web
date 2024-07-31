import { axiosPrivate } from '@/lib/api/axios';
import { configurationEndpoints } from '@/lib/configuration/endpoints';
import {
  PermissionSchemaType,
  RoleSchemaType,
  UserSchemaResponseType,
} from '@/lib/configuration/schema';
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
  PermissionSchemaType[] | ErrorMessage
> {
  try {
    const { data: response }: AxiosResponse<Response<PermissionSchemaType[]>> =
      await axiosPrivate.get(`${configurationEndpoints.PERMISSIONS}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
    if (response?.data) {
      return response?.data;
    }
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message || errorMessage;
    }
    return { message: errorMessage };
  }
}

export async function getAllRoles(
  compnayId: string
): Promise<RoleSchemaType[] | ErrorMessage> {
  try {
    const { data: response }: AxiosResponse<Response<RoleSchemaType[]>> =
      await axiosPrivate.get(
        `${configurationEndpoints.ALL_ROLES}/${compnayId}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    if (response?.data) {
      return response?.data;
    }
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message || errorMessage;
    }
    return { message: errorMessage };
  }
}
