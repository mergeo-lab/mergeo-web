import { axiosPrivate } from '@/lib/api/axios';
import {
  SEARCH_PRODUCTS,
  PRE_ORDER,
  CLIENT_PRE_ORDER,
  BUY_ORDER,
  ORDERS_EVENTS,
} from './endpoints';
import { ProductWithQuantity, CartProductQuantity } from '@/store/search.store';
import { AxiosResponse, isAxiosError } from 'axios';
import { ReplacementCriteria } from '@/lib/constants';
import {
  OrderSchemaType,
  PaginationSort,
  PaginationType,
  PreOrderSchemaType,
  NewPreOrderSchemaType,
  ProductSchemaType,
  ClientPreOrdersResponseSchemaType,
} from '@/lib/schemas';
import { BuyOrderSchemaType } from '@/lib/schemas/orders.schema';
import { SellProductSchemaType } from '@/lib/schemas/sell.schema';

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
  onlyFavorites?: boolean;
};

export async function getProducts(
  companyId: string,
  searchParams: SearchParams,
  pagination: PaginationType
): Promise<{
  products: ProductSchemaType[];
  currentPage: number;
  total: number;
  totalPages: number;
}> {
  const {
    branchId,
    expectedDeliveryStartDay,
    expectedDeliveryEndDay,
    startHour,
    endHour,
    name,
    brand,
    isPickUp,
    pickUpLat,
    pickUpLng,
    pickUpRadius,
    onlyFavorites,
  } = searchParams;

  const params: Record<string, unknown> = {
    branchId,
    expectedDeliveryStartDay,
    expectedDeliveryEndDay,
    startHour,
    endHour,
  };

  // pagination
  params.page = pagination.page || 1;
  params.pageSize = pagination.pageSize || 10;
  params.sortOrder = pagination.sortOrder || PaginationSort.ASC;
  if (pagination.orderBy) params.orderBy = pagination.orderBy;

  // Add optional parameters if they are defined
  if (name) params.name = name;
  if (brand) params.brand = brand;
  if (isPickUp !== undefined) params.isPickUp = isPickUp;
  if (pickUpLat !== undefined) params.pickUpLat = pickUpLat;
  if (pickUpLng !== undefined) params.pickUpLng = pickUpLng;
  if (pickUpRadius !== undefined) params.pickUpRadius = pickUpRadius;
  if (onlyFavorites !== undefined) params.onlyFavorites = onlyFavorites;

  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${SEARCH_PRODUCTS}/${companyId}`,
      {
        params,
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

/**
 * Creates a pre-order for a user based on search parameters, replacement criteria, and the products in the user's cart.
 * Sends a request to fetch available products based on specified search criteria and returns a response with the count and products.
 *
 * @param userId - The ID of the user for whom the pre-order is being created.
 * @param searchParams - The search parameters used to filter available products, including branch location and delivery information:
 *   - branchId: ID of the branch where the products will be sourced.
 *   - expectedDeliveryStartDay: Start date for expected delivery.
 *   - expectedDeliveryEndDay: End date for expected delivery.
 *   - startHour: Starting hour for delivery.
 *   - endHour: Ending hour for delivery.
 *   - isPickUp: Boolean indicating if the order is for pickup.
 *   - pickUpLat: Latitude of the pickup location.
 *   - pickUpLng: Longitude of the pickup location.
 *   - pickUpRadius: Radius around the pickup location for available products.
 * @param replacementCriteria - The criteria for product replacements in case certain items are unavailable.
 * @param cartProducts - Array of products in the user's cart, each with details such as product ID, quantity, etc.
 *
 * @returns A Promise resolving to an object containing:
 *   - count: The total count of products that match the criteria.
 *   - products: An array of `CartProduct` items that meet the search and replacement criteria.
 *
 * @throws {Error} Throws an error if the request fails. If an Axios error occurs:
 *   - Sets a generic error message for HTTP status 400 (Bad Request).
 *   - Sets the error message based on the API response for other status codes.
 */ export async function cratePreOrder({
  userId,
  searchParams,
  reacteplacementCriteria,
  cartProducts,
}: {
  userId: string | undefined;
  searchParams: SearchParams;
  reacteplacementCriteria: ReplacementCriteria;
  cartProducts: ProductWithQuantity[];
}): Promise<{ message: string; preOrderId: string }> {
  const {
    branchId,
    expectedDeliveryStartDay,
    expectedDeliveryEndDay,
    startHour,
    endHour,
    isPickUp,
    pickUpLat,
    pickUpLng,
    pickUpRadius,
  } = searchParams;

  const sp = {
    branchId,
    expectedDeliveryStartDay,
    expectedDeliveryEndDay,
    startHour,
    endHour,
    isPickUp,
    pickUpLat,
    pickUpLng,
    pickUpRadius,
  };

  const productsWithQuantity: CartProductQuantity[] = cartProducts.map(
    (product) => ({
      id: product.id,
      quantity: product.quantity ?? 1, // Use 0 as default if quantity is not defined
      price: product.price.toString(), // Ensure price is a string
      providerId: product.providerId,
      dropZoneId: product.dropZoneId,
      delivery_date: product.deliveryDate || null,
      replacementCriteria: product.replacementCriteria || null,
    })
  );

  const payload = {
    searchParams: sp,
    replacementCriteria: reacteplacementCriteria,
    cartProducts: productsWithQuantity,
  };

  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      `${PRE_ORDER}/${userId}`,
      JSON.stringify({ ...payload })
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

export async function getAllPreOrders(
  companyId: string
): Promise<{ count: number; preOrders: PreOrderSchemaType[] }> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRE_ORDER}/${companyId}/client`,
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

export async function getAllPreOrdersPaginated(
  companyId: string,
  pagination: {
    page?: number;
    take?: number;
  },
  filters?: {
    status?: string;
    sortByCreated?: boolean;
    sortOrder?: 'ASC' | 'DESC';
  }
): Promise<{
  preOrders: PreOrderSchemaType[];
  currentPage: number;
  total: number;
  totalPages: number;
}> {
  try {
    const params: Record<string, unknown> = {};

    // pagination
    params.page = pagination.page || 1;
    params.take = pagination.take || 30;

    // filters
    if (filters?.status) params.status = filters.status;
    if (filters?.sortByCreated !== undefined)
      params.sortByCreated = filters.sortByCreated;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRE_ORDER}/${companyId}/client`,
      {
        params,
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

export async function getSellPreOrders(
  companyId: string
): Promise<PreOrderSchemaType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRE_ORDER}/${companyId}/provider`,
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

export async function getSellPreOrdersPaginated(
  companyId: string,
  pagination: {
    page?: number;
    take?: number;
  },
  filters?: {
    status?: string;
    zone?: string; // This will be the dropZoneId
    sortByCreated?: boolean;
    sortOrder?: 'ASC' | 'DESC';
  }
): Promise<{
  preOrders: PreOrderSchemaType[];
  currentPage: number;
  total: number;
  totalPages: number;
}> {
  try {
    const params: Record<string, unknown> = {};

    // pagination
    params.page = pagination.page || 1;
    params.take = pagination.take || 30;

    // filters
    if (filters?.status) params.status = filters.status;
    if (filters?.zone) params.dropZoneId = filters.zone;
    if (filters?.sortByCreated !== undefined)
      params.sortByCreated = filters.sortByCreated;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    console.log('getSellPreOrdersPaginated - sending params:', params);

    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRE_ORDER}/${companyId}/provider`,
      {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(
      'getSellPreOrdersPaginated - response received:',
      response.data
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

export async function getSellPreOrdersById(
  preOrderId: string
): Promise<PreOrderSchemaType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRE_ORDER}/${preOrderId}`,
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

export async function getAllBuyOrders(
  companyId: string,
  isClient: boolean = true
): Promise<BuyOrderSchemaType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${BUY_ORDER}/${companyId}/${isClient ? 'client' : 'provider'}`,
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

export async function getAllBuyOrdersPaginated(
  companyId: string,
  isClient: boolean = true,
  pagination: {
    page?: number;
    take?: number;
  },
  filters?: {
    viewed?: boolean;
    clientId?: string;
    sortByCreated?: boolean;
    sortOrder?: 'ASC' | 'DESC';
  }
): Promise<{
  buyOrders: BuyOrderSchemaType[];
  currentPage: number;
  total: number;
  totalPages: number;
}> {
  try {
    const params: Record<string, unknown> = {};

    // pagination
    params.page = pagination.page || 1;
    params.take = pagination.take || 30;

    // filters
    if (filters?.viewed !== undefined) params.viewed = filters.viewed;
    if (filters?.clientId) params.clientId = filters.clientId;
    if (filters?.sortByCreated !== undefined)
      params.sortByCreated = filters.sortByCreated;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${BUY_ORDER}/${companyId}/${isClient ? 'client' : 'provider'}/paginated`,
      {
        params,
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

export async function getOrderById(orderId: string): Promise<OrderSchemaType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${BUY_ORDER}/${orderId}`,
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

export async function markBuyOrderAsViewed(orderId: string): Promise<void> {
  try {
    await axiosPrivate.post(
      `${BUY_ORDER}/${orderId}/mark-as-viewed`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
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

export async function preOrderEvents(
  companyId: string
): Promise<{ count: number; preOrders: PreOrderSchemaType[] }> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${ORDERS_EVENTS}/${companyId}`,
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

// PROVIDER RESPONSE
export async function preOrderProviderResponse({
  orderId,
  acceptedProducts,
  rejectedProducts,
}: {
  orderId: string;
  acceptedProducts: SellProductSchemaType[];
  rejectedProducts: SellProductSchemaType[];
}): Promise<{ count: number; preOrders: PreOrderSchemaType[] }> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      `${PRE_ORDER}/${orderId}/provider-response`,
      JSON.stringify({ acceptedProducts, rejectedProducts }),
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

// CLIENT PRE-ORDER FUNCTIONS
export async function createClientPreOrder({
  searchParams,
  reacteplacementCriteria,
  cartProducts,
}: {
  userId: string | undefined;
  searchParams: SearchParams;
  reacteplacementCriteria: ReplacementCriteria;
  cartProducts: ProductWithQuantity[];
}): Promise<{ message: string; preOrderId: string }> {
  const {
    branchId,
    expectedDeliveryStartDay,
    expectedDeliveryEndDay,
    startHour,
    endHour,
    isPickUp,
    pickUpLat,
    pickUpLng,
    pickUpRadius,
  } = searchParams;

  const sp = {
    branchId,
    expectedDeliveryStartDay,
    expectedDeliveryEndDay,
    startHour,
    endHour,
    isPickUp,
    pickUpLat,
    pickUpLng,
    pickUpRadius,
  };

  const productsWithQuantity: CartProductQuantity[] = cartProducts.map(
    (product) => ({
      id: product.id,
      quantity: product.quantity ?? 1,
      price: product.price.toString(),
      providerId: product.providerId,
      dropZoneId: product.dropZoneId,
      delivery_date: product.deliveryDate || null,
      replacementCriteria: product.replacementCriteria || null,
    })
  );

  const payload = {
    searchParams: sp,
    replacementCriteria: reacteplacementCriteria,
    cartProducts: productsWithQuantity,
  };

  try {
    const { data: response }: AxiosResponse = await axiosPrivate.post(
      `${CLIENT_PRE_ORDER}`,
      JSON.stringify({ ...payload })
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

export async function getClientPreOrderById(
  preOrderId: string
): Promise<NewPreOrderSchemaType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${CLIENT_PRE_ORDER}/${preOrderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('getClientPreOrderById - Full response:', response);
    console.log('getClientPreOrderById - response.data:', response.data);
    console.log('getClientPreOrderById - response type:', typeof response);
    console.log(
      'getClientPreOrderById - response keys:',
      Object.keys(response)
    );

    // Check if data is directly in response or in response.data
    const data = response.data || response;

    if (!data) {
      console.error('getClientPreOrderById - No data found in response!');
      throw new Error('No data received from API');
    }

    console.log('getClientPreOrderById - Final data to return:', data);
    return data;
  } catch (error) {
    console.error('getClientPreOrderById - Error:', error);
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

export async function getClientPreOrdersByBuyerId(
  buyerId: string
): Promise<PreOrderSchemaType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${CLIENT_PRE_ORDER}/buyer/${buyerId}`,
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

export async function getMyClientPreOrders(
  pagination: {
    page?: number;
    take?: number;
  },
  filters?: {
    status?: string;
    sortByCreated?: boolean;
    sortOrder?: 'ASC' | 'DESC';
  }
): Promise<ClientPreOrdersResponseSchemaType> {
  try {
    const params: Record<string, unknown> = {};

    // pagination
    params.page = pagination.page || 1;
    params.take = pagination.take || 30;

    // filters
    if (filters?.status) params.status = filters.status;
    if (filters?.sortByCreated !== undefined)
      params.sortByCreated = filters.sortByCreated;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${CLIENT_PRE_ORDER}/my-orders`,
      {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('getMyClientPreOrders response:', response);
    console.log('getMyClientPreOrders response.data:', response.data);

    // Return the data directly from the response
    return response.data;
  } catch (error) {
    console.error('getMyClientPreOrders - Error details:', error);
    if (isAxiosError(error)) {
      console.error(
        'getMyClientPreOrders - Axios error response:',
        error.response
      );
      console.error(
        'getMyClientPreOrders - Axios error status:',
        error.response?.status
      );
      console.error(
        'getMyClientPreOrders - Axios error data:',
        error.response?.data
      );
      if (error.response?.data.statusCode === 400) {
        error.message = 'Algo salio mal, vuelve a intentarlo!';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}

export async function getAllClientPreOrders(_preOrderId: string): Promise<any> {
  return getMyClientPreOrders({ page: 1, take: 1000 });
}

export async function checkPreOrders(buyerId: string): Promise<any> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${CLIENT_PRE_ORDER}/${buyerId}/complete`
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
  }
}
