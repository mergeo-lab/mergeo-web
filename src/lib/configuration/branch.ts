import { axiosPrivate } from '@/lib/api/axios';
import { AxiosResponse, isAxiosError } from 'axios';
import { Response } from '@/types';
import { branchEndpoint } from '@/lib/configuration/endpoints';
import {
  BranchesSchemaResultsType,
  BranchesSchemaType,
} from './schemas/branches.schemas';

export async function newBranch({
  companyId,
  body,
}: {
  companyId: string;
  body: BranchesSchemaType;
}): Promise<Response<BranchesSchemaType>> {
  try {
    console.log(companyId);
    console.log(body);
    const response: Response<BranchesSchemaType> = await axiosPrivate.post(
      branchEndpoint(companyId),
      JSON.stringify({ ...body }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response);
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

export async function getBranches({
  companyId,
}: {
  companyId: string;
}): Promise<Response<BranchesSchemaResultsType>> {
  try {
    const {
      data: response,
    }: AxiosResponse<Response<BranchesSchemaResultsType>> =
      await axiosPrivate.get(branchEndpoint(companyId), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
