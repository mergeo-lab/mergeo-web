import { axiosPrivate } from '@/lib/api/axios';
import {
  BRANCHES_INFO,
  CLIENT_CHART,
  LATEST_ORDERS,
  LIST_COUNT,
  PRDOUCTS_STATS,
} from '@/lib/dashboard/endpoints';
import {
  ChartDataType,
  ClientProductsStatsType,
  DashboardBranchType,
  DashboardListCountType,
  DashboardOrdersType,
} from '@/lib/schemas/dashboard.schema';
import { AxiosResponse, isAxiosError } from 'axios';

// this is is for account type CLIENT
export async function getLatestOrders(
  companyId: string
): Promise<DashboardOrdersType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${LATEST_ORDERS}/${companyId}/3`,
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

// this is is for account type CLIENT
export async function getDashboardBranches(
  companyId: string
): Promise<DashboardBranchType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${BRANCHES_INFO}/${companyId}`,
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

// this is is for account type CLIENT
export async function getClientChartData(
  companyId: string
): Promise<ChartDataType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${CLIENT_CHART}/${companyId}`,
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

export async function getDashboardListCounts(
  companyId: string
): Promise<DashboardListCountType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${LIST_COUNT}/${companyId}`,
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

export async function getClientProductsStats(
  companyId: string
): Promise<ClientProductsStatsType> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${PRDOUCTS_STATS}/${companyId}`,
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
