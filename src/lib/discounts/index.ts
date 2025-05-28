import { axiosPrivate } from '@/lib/api/axios';
import {
  DISCOUNT_BASE,
  DISCOUNT_BY_ID,
  DISCOUNT_UPDATE,
} from '@/lib/discounts/endpoints';
import { PaginationType, ProductSchemaType } from '@/lib/schemas';
import {
  DiscountFormSchemaType,
  DiscountProductSearchSchemaType,
} from '@/lib/schemas/discounts.schema';
import { AxiosResponse, isAxiosError } from 'axios';

export async function createDiscountList({
  id,
  body,
  companies,
}: {
  id: string;
  body: DiscountFormSchemaType;
  companies: string[];
}) {
  try {
    const transformedBody = {
      ...body,
      companies,
    };

    const { data: response }: AxiosResponse = await axiosPrivate.post(
      `${DISCOUNT_BASE}/${id}`,
      JSON.stringify(transformedBody),
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

export async function updateDiscountList({
  id,
  body,
  companies,
}: {
  id: string;
  body: DiscountFormSchemaType;
  companies: string[];
}) {
  try {
    const transformedBody = {
      ...body,
      companies,
    };
    const { data: response }: AxiosResponse = await axiosPrivate.patch(
      `${DISCOUNT_UPDATE}/${id}`,
      JSON.stringify(transformedBody),
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

export async function getAllDiscountList(companyId: string) {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${DISCOUNT_BASE}/${companyId}`,
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

export async function getDiscountListProducts(
  searchParams: DiscountProductSearchSchemaType,
  pagination: PaginationType
): Promise<{
  products: ProductSchemaType[];
  currentPage: number;
  total: number;
  totalPages: number;
}> {
  try {
    const params: Record<string, string | number | boolean> = {};

    // pagination
    params.page = pagination.page || 1;
    params.pageSize = pagination.pageSize || 10;
    params.sortOrder = pagination.sortOrder || 'asc';

    console.log('SP: ', params);

    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${DISCOUNT_BY_ID}/${searchParams.listId}`,
      {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response);
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

export async function saveDiscountProducts({
  listId,
  products,
}: {
  listId: string;
  products: string[];
}) {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      `${DISCOUNT_BASE}/${listId}/add-products`,
      JSON.stringify([...products]),
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
export async function removeDiscountProducts({
  listId,
  products,
}: {
  listId: string;
  products: string[];
}) {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      `${DISCOUNT_BASE}/${listId}/remove-products`,
      JSON.stringify([...products]),
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
