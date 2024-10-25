import { axiosPrivate } from '@/lib/api/axios';
import { AxiosResponse, isAxiosError } from 'axios';
import { Response } from '@/types';
import { BranchesSchemaResultsType, BranchesSchemaType } from '@/lib/schemas';
import {
  BRANCH,
  BRANCH_EDIT,
  BRANCH_DELETE,
} from '@/lib/configuration/endpoints';

export async function newBranch({
  companyId,
  body,
}: {
  companyId: string;
  body: BranchesSchemaType;
}): Promise<Response<BranchesSchemaType>> {
  try {
    const response: Response<BranchesSchemaType> = await axiosPrivate.post(
      BRANCH(companyId),
      JSON.stringify({ ...body }),
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

export async function editBranch({
  branchId,
  body,
}: {
  branchId: string;
  body: Partial<BranchesSchemaType>;
}): Promise<Response<BranchesSchemaType>> {
  try {
    const response: Response<BranchesSchemaType> = await axiosPrivate.patch(
      BRANCH_EDIT(branchId),
      JSON.stringify({ ...body }),
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

export async function getBranches({
  companyId,
}: {
  companyId: string;
}): Promise<Response<BranchesSchemaResultsType>> {
  try {
    const {
      data: response,
    }: AxiosResponse<Response<BranchesSchemaResultsType>> =
      await axiosPrivate.get(BRANCH(companyId), {
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

export async function deletBranch({ id }: { id: string }): Promise<void> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.delete(
      BRANCH_DELETE(id),
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
