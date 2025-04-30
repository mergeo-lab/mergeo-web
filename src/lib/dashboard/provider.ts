import { axiosPrivate } from '@/lib/api/axios';
import {
  BEST_ZONE,
  CHART,
  PENDING_ORDERS,
  SELL_INFO,
  TOP_SELLED_PRODUCTS,
  USERS_PERFORMANCE,
} from './endpoints';
import { AxiosResponse, isAxiosError } from 'axios';
import {
  BestZoneResponseType,
  ChartDataType,
  DashboardOrdersType,
  ProductsStatsType,
  SellInfoResponseType,
  UserPerformanceType,
} from '@/lib/schemas/dashboard.schema';

export async function getSellInfo(
  companyId: string
): Promise<SellInfoResponseType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${SELL_INFO}/${companyId}`,
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

export async function getBestZone(
  companyId: string
): Promise<BestZoneResponseType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${BEST_ZONE}/${companyId}`,
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

export async function getChartData(companyId: string): Promise<ChartDataType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${CHART}/${companyId}`,
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

export async function getUsersPerformance(
  companyId: string
): Promise<UserPerformanceType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${USERS_PERFORMANCE}/${companyId}`,
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

export async function getProductsStats(
  companyId: string
): Promise<ProductsStatsType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${TOP_SELLED_PRODUCTS}/${companyId}`,
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

export async function getPendingOrders(
  companyId: string
): Promise<DashboardOrdersType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PENDING_ORDERS}/${companyId}`,
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
