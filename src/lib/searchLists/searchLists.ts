import { axiosPrivate } from '@/lib/api/axios';
import { AxiosResponse, isAxiosError } from 'axios';
import {
  SearchListProductType,
  SearchListType,
  SearchListsResultsType,
} from '@/lib/searchLists/searchLists.schemas';
import { SEARCH_LISTS } from '@/lib/searchLists/endpoints';

export async function newSearchList({
  companyId,
  body,
}: {
  companyId: string;
  body: Omit<SearchListType, 'id'>;
}): Promise<{ data: SearchListType }> {
  try {
    const productsWithoutId =
      body.products && body.products.map(({ id, ...rest }) => rest);
    const response: AxiosResponse = await axiosPrivate.post(
      `${SEARCH_LISTS}/${companyId}`,
      { ...body, products: productsWithoutId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
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

export async function getSearchLists(
  companyId: string
): Promise<SearchListsResultsType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${SEARCH_LISTS}/${companyId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
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

export async function deleteSearchList({ id }: { id: string }): Promise<void> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.delete(
      `${SEARCH_LISTS}/${id}`,
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
        error.message = 'Algo salio mal intentalo de nuevo';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}

export async function updateListName({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<void> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.patch(
      `${SEARCH_LISTS}/list/${id}`,
      { name },
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
        error.message = 'Algo salio mal intentalo de nuevo';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}

// PRODUCTS
export async function addProductsToList({
  listId,
  body,
}: {
  listId: string;
  body: SearchListProductType[];
}): Promise<{ data: SearchListType }> {
  try {
    const productsWithoutId = body && body.map(({ id, ...rest }) => rest);
    console.log(productsWithoutId);
    const response: AxiosResponse = await axiosPrivate.post(
      `${SEARCH_LISTS}/${listId}/products`,
      productsWithoutId,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
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

export async function uploadSearchListFile({
  listId,
  body,
}: {
  listId: string;
  body: FormData;
}): Promise<{ data: SearchListType }> {
  try {
    const response: AxiosResponse = await axiosPrivate.post(
      `${SEARCH_LISTS}/${listId}/products/upload`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
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

export async function deleteProduct(args: {
  id: string;
  otherMutationProp: unknown;
}): Promise<void> {
  const { id, otherMutationProp: listId } = args;
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.delete(
      `${SEARCH_LISTS}/${listId}/products/${id}`,
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
        error.message = 'Algo salio mal intentalo de nuevo';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}
