import { create } from 'zustand';

export type PreOrdersSortOptionsType = {
  id: string;
  name: string;
  sortOrder: 'ASC' | 'DESC';
};

export const preOrdersSortOptions: PreOrdersSortOptionsType[] = [
  {
    id: 'created-desc',
    name: 'Más Reciente',
    sortOrder: 'DESC',
  },
  {
    id: 'created-asc',
    name: 'Más Antigua',
    sortOrder: 'ASC',
  },
];

export type PreOrdersStatusFilterType = {
  id: string;
  name: string;
  value: string;
};

// Provider Pre-Orders Status Filters
export const providerPreOrdersStatusFilters: PreOrdersStatusFilterType[] = [
  {
    id: 'all',
    name: 'Todos',
    value: '',
  },
  {
    id: 'rejected',
    name: 'Rechazado',
    value: 'rejected',
  },
  {
    id: 'expired',
    name: 'Expirado',
    value: 'timeout',
  },
  {
    id: 'accepted',
    name: 'Aceptado',
    value: 'accepted',
  },
  {
    id: 'partialy-accepted',
    name: 'Parcialmente Aceptado',
    value: 'partialy-accepted',
  },
];

export type PreOrdersZoneFilterType = {
  id: string;
  name: string;
  value: string;
};

export const preOrdersZoneFilters: PreOrdersZoneFilterType[] = [
  {
    id: 'all',
    name: 'Todas las Zonas',
    value: '',
  },
];

type ProviderPreOrdersPaginationState = {
  page: number;
  statusFilter: PreOrdersStatusFilterType;
  zoneFilter: PreOrdersZoneFilterType;
  sort: PreOrdersSortOptionsType;
  showOnlyWithPurchaseOrders: boolean;
  setPage: (number: number) => void;
  getPage: () => number;
  setStatusFilter: (filter: PreOrdersStatusFilterType) => void;
  setZoneFilter: (filter: PreOrdersZoneFilterType) => void;
  setSort: (sort: PreOrdersSortOptionsType) => void;
  setShowOnlyWithPurchaseOrders: (show: boolean) => void;
};

const UseProviderPreOrdersPaginationState = create<ProviderPreOrdersPaginationState>(
  (set, get) => ({
    page: 1,
    statusFilter: providerPreOrdersStatusFilters[0],
    zoneFilter: preOrdersZoneFilters[0],
    sort: preOrdersSortOptions[0],
    showOnlyWithPurchaseOrders: false,

    setPage: (page: number) => set(() => ({ page })),
    getPage: () => get().page,

    setStatusFilter: (statusFilter: PreOrdersStatusFilterType) =>
      set(() => ({ statusFilter })),

    setZoneFilter: (zoneFilter: PreOrdersZoneFilterType) =>
      set(() => ({ zoneFilter })),

    setSort: (sort: PreOrdersSortOptionsType) => set(() => ({ sort })),

    setShowOnlyWithPurchaseOrders: (show: boolean) =>
      set(() => ({ showOnlyWithPurchaseOrders: show })),
  })
);

export default UseProviderPreOrdersPaginationState;
