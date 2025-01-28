import { axiosPrivate } from '@/lib/api/axios';
import {
  PROVIDER_PRODUCT_SEARCH,
  PRODUCT_LISTS,
  PRODUCT_ADD_MULTIPLE,
} from './endpoints';
import { AxiosResponse, isAxiosError } from 'axios';
import {
  PreOrderProductDetailSchemaType,
  ProductsListSchemaType,
  ProviderProductSearchType,
} from '@/lib/schemas';
import { AddProduct } from '@/store/addProductItem.store';

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

export async function providerProductsSearch(
  searchParams: ProviderProductSearchType
): Promise<{ products: PreOrderProductDetailSchemaType[]; count: number }> {
  try {
    const params: Record<string, string | number> = {};

    if (searchParams.companyId) params.companyId = searchParams.companyId;
    // if ean present we just send the EAN
    if (searchParams.ean) params.ean = searchParams.ean;
    else {
      if (searchParams.name) params.name = searchParams.name;
      if (searchParams.brand) params.brand = searchParams.brand;
    }

    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PROVIDER_PRODUCT_SEARCH}`,
      {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response /search:', response);
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

export async function saveMultipleProducts(
  products: Partial<AddProduct>[],
  companyId: string
): Promise<PreOrderProductDetailSchemaType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      `${PRODUCT_ADD_MULTIPLE}/${companyId}`,
      JSON.stringify(products),
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
