import { axiosPrivate } from '@/lib/api/axios';
import {
  PROVIDER_PRODUCT_SEARCH,
  PRODUCT_LISTS,
  PRODUCT_ADD_MULTIPLE,
  PRODUCT,
  PRODUCT_METADATA,
  PRODUCT_UPLOAD,
  PROVIDER_NEW_PRODUCT_SEARCH,
  PRODUCT_FAVORITE,
  PRODUCT_BLACKLIST,
} from './endpoints';
import { AxiosResponse, isAxiosError } from 'axios';
import {
  NewProductSearchType,
  PaginationType,
  ProductMetadataType,
  ProductSchemaType,
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
  searchParams: ProviderProductSearchType,
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
    params.includeInventory = searchParams.includeInventory;

    if (pagination.orderBy) params.orderBy = pagination.orderBy;
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

export async function newProductsSearch(
  searchParams: NewProductSearchType
): Promise<{
  products: ProductSchemaType[];
}> {
  try {
    const params: Record<string, string | number | boolean> = {};

    if (searchParams.companyId) params.companyId = searchParams.companyId;
    // if ean present we just send the EAN
    if (searchParams.ean) params.ean = searchParams.ean;
    else {
      if (searchParams.name) params.name = searchParams.name;
      if (searchParams.brand) params.brand = searchParams.brand;
    }

    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PROVIDER_NEW_PRODUCT_SEARCH}`,
      {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('PRODUCTOS NUEVOS :', response.data);
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

export async function getProductById(
  porductId: string
): Promise<ProductSchemaType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRODUCT}/${porductId}`,
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

export async function modifyProduct(
  porductId: string,
  price: string,
  description: string | undefined
): Promise<ProductSchemaType> {
  try {
    const params: Record<string, string | number | boolean> = {};

    if (price) params.price = price;
    if (description) params.description = description;

    const { data: response }: AxiosResponse = await axiosPrivate.patch(
      `${PRODUCT}/${porductId}`,
      JSON.stringify(params),
      {
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

export async function getProductMetadata(
  porductId: string
): Promise<ProductMetadataType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRODUCT_METADATA}/${porductId}`,
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

export async function saveMultipleProducts(
  products: Partial<AddProduct>[],
  companyId: string
): Promise<ProductSchemaType[]> {
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

export async function uploadProductsFile({
  companyId,
  body,
}: {
  companyId: string;
  body: FormData;
}): Promise<{ data: { products: ProductSchemaType[]; count: number } }> {
  try {
    const response: AxiosResponse = await axiosPrivate.post(
      `${PRODUCT_UPLOAD}/${companyId}`,
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

export async function getFavorites(
  companyId: string
): Promise<ProductSchemaType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRODUCT_FAVORITE}/${companyId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('FAVORITOS :', response.data);
    return response.data.products;
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

export async function toggleFavorite(
  companyId: string,
  productId: string,
  newState: boolean
): Promise<ProductSchemaType[]> {
  try {
    const path = newState
      ? `${PRODUCT_FAVORITE}/${companyId}/product/${productId}`
      : `${PRODUCT_FAVORITE}/${companyId}/product/${productId}/remove`;

    const { data: response }: AxiosResponse = await axiosPrivate.post(path, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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

export async function addToBlackList(
  companyId: string,
  productId: string
): Promise<ProductSchemaType[]> {
  try {
    const path = `${PRODUCT_BLACKLIST}/${companyId}`;

    const { data: response }: AxiosResponse = await axiosPrivate.post(
      path,
      JSON.stringify([productId]),
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

export async function getBlackList(
  companyId: string
): Promise<ProductSchemaType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRODUCT_BLACKLIST}/${companyId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.products;
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
