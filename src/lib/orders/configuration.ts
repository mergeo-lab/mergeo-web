import { axiosPrivate } from '@/lib/api/axios';
import { AxiosResponse, isAxiosError } from 'axios';
import { SearchListType } from '@/lib/searchLists/searchLists.schemas';
import { SEARCH_LISTS } from '@/lib/searchLists/endpoints';

export async function search({
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
