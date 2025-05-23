import { axiosPrivate } from '@/lib/api/axios';
import { DISCOUNT_BASE, DISCOUNT_BY_ID } from '@/lib/discounts/endpoints';
import { CreateDiscountSchemaType } from '@/lib/schemas/discounts.schema';
import { AxiosResponse, isAxiosError } from 'axios';

export async function createDiscountList({
  companyId,
  body,
}: {
  companyId: string;
  body: CreateDiscountSchemaType;
}) {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      `${DISCOUNT_BASE}/${companyId}`,
      JSON.stringify(body),
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

export async function getDiscountListProducts(id: string) {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${DISCOUNT_BY_ID}/${id}`,
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
