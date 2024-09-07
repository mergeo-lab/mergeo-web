import { axiosPrivate } from '@/lib/api/axios';
import { AxiosResponse, isAxiosError } from 'axios';
import {
  PICK_UP,
  PICK_UP_DELETE,
  PICK_UP_EDIT,
} from '@/lib/configuration/endpoints';

import { PickUpSchemaType } from '@/lib/configuration/schemas/pickUp.schema';

export async function newPickUpPoints({
  companyId,
  body,
}: {
  companyId: string;
  body: PickUpSchemaType;
}): Promise<PickUpSchemaType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      PICK_UP(companyId),
      JSON.stringify({ ...body }),
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

export async function editPickUpPoints({
  branchId,
  body,
}: {
  branchId: string;
  body: Partial<PickUpSchemaType>;
}): Promise<PickUpSchemaType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.patch(
      PICK_UP_EDIT(branchId),
      JSON.stringify({ ...body }),
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

export async function getPickUpPoints({
  companyId,
}: {
  companyId: string;
}): Promise<PickUpSchemaType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      PICK_UP(companyId),
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

export async function deletPickUpPoint({ id }: { id: string }): Promise<void> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.delete(
      PICK_UP_DELETE(id),
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
        error.message = 'El email o la contraseña son incorrectos';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}
