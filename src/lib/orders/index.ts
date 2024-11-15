import { axiosPrivate } from '@/lib/api/axios';
import { SEARCH_PRODUCTS, PRE_ORDER } from './endpoints';
import { CartProduct, ProductWithQuantity } from '@/store/search.store';
import { AxiosResponse, isAxiosError } from 'axios';
import { ReplacementCriteria } from '@/lib/constants';

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

export async function getProducts(
  companyId: string,
  searchParams: SearchParams
): Promise<{ count: number; products: CartProduct[] }> {
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
  } = searchParams;

  const params: Record<string, unknown> = {
    branchId,
    expectedDeliveryStartDay,
    expectedDeliveryEndDay,
    startHour,
    endHour,
  };

  // Add optional parameters if they are defined
  if (name) params.name = name;
  if (brand) params.brand = brand;
  if (isPickUp !== undefined) params.isPickUp = isPickUp;
  if (pickUpLat !== undefined) params.pickUpLat = pickUpLat;
  if (pickUpLng !== undefined) params.pickUpLng = pickUpLng;
  if (pickUpRadius !== undefined) params.pickUpRadius = pickUpRadius;

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = response.products.map((product: any) => {
      const { company, ...rest } = product; // Destructure to exclude 'company'
      return {
        providerId: company.id, // Extracting the company ID
        ...rest, // Spread remaining properties
      };
    });

    return {
      count: response.count,
      products: products,
    };
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
}): Promise<string> {
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

  const productsWithQuantity: ProductWithQuantity[] = cartProducts.map(
    (product) => ({
      id: product.id,
      quantity: product.quantity ?? 1, // Use 0 as default if quantity is not defined
      providerId: product.providerId,
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
