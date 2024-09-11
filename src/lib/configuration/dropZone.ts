import { axiosPrivate } from '@/lib/api/axios';
import { AxiosResponse, isAxiosError } from 'axios';
import { DROP_ZONE } from '@/lib/configuration/endpoints';

import { DropZoneSchemaType } from '@/lib/configuration/schemas/dropZone.schemas';

export async function newDropZone({
  companyId,
  body,
}: {
  companyId: string;
  body: DropZoneSchemaType;
}): Promise<DropZoneSchemaType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      DROP_ZONE(companyId),
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

// export async function editPickUpPoints({
//   branchId,
//   body,
// }: {
//   branchId: string;
//   body: Partial<PickUpSchemaType>;
// }): Promise<PickUpSchemaType> {
//   try {
//     const { data: response }: AxiosResponse = await axiosPrivate.patch(
//       PICK_UP_EDIT(branchId),
//       JSON.stringify({ ...body }),
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return response;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       if (error.response?.data.statusCode === 400) {
//         error.message = 'Algo salio mal, vuelve a intentarlo!';
//       } else {
//         error.message = error.response?.data.message;
//       }
//     }

//     throw error;
//   }
// }

export async function getDropZones({
  companyId,
}: {
  companyId: string;
}): Promise<{ data: DropZoneSchemaType[] }> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      DROP_ZONE(companyId),
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

// export async function deletPickUpPoint({ id }: { id: string }): Promise<void> {
//   try {
//     const { data: response }: AxiosResponse = await axiosPrivate.delete(
//       PICK_UP_DELETE(id),
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return response;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       if (error.response?.data.statusCode === 400) {
//         error.message = 'El email o la contraseña son incorrectos';
//       } else {
//         error.message = error.response?.data.message;
//       }
//     }

//     throw error;
//   }
// }
