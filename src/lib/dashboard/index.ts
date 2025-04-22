import { axiosPrivate } from '@/lib/api/axios';
import { BEST_ZONE, CHART, SELL_INFO } from './endpoints';
import { AxiosResponse, isAxiosError } from 'axios';
import {
  BestZoneResponseType,
  SalesChartType,
  SellInfoResponseType,
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

export async function getChartData(companyId: string): Promise<SalesChartType> {
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
