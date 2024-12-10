import { axiosPrivate } from '@/lib/api/axios';
import { GS1_SEARCH, PRODUCT_LISTS } from './endpoints';
import { AxiosResponse, isAxiosError } from 'axios';
import {
  Gs1SearchSchemaType,
  PreOrderProductDetailSchemaType,
  ProductsListSchemaType,
} from '@/lib/schemas';

export type SearchParams = {
  branchId?: string;
  expectedDeliveryStartDay?: string;
  expectedDeliveryEndDay?: string;
  startHour?: string;
  endHour?: string;
  name?: string;
  brand?: string;
  isPickUp?: boolean;
  pickUpLat?: number;
  pickUpLng?: number;
  pickUpRadius?: number;
};

export async function getProductsLists({
  companyId,
}: {
  companyId: string;
}): Promise<ProductsListSchemaType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRODUCT_LISTS}/${companyId}`,
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

export async function createProductsList({
  name,
  companyId,
}: {
  name: string;
  companyId: string;
}): Promise<ProductsListSchemaType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      `${PRODUCT_LISTS}`,
      JSON.stringify({ name: name, companyId }),
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

export async function searchGs1Products(
  searchParams: Gs1SearchSchemaType
): Promise<PreOrderProductDetailSchemaType[]> {
  try {
    const params: Record<string, string | number> = {};

    if (searchParams.name) params.name = searchParams.name;
    if (searchParams.brand) params.brand = searchParams.brand;

    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${GS1_SEARCH}`,
      {
        params,
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
