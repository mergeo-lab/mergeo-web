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

export const preOrdersStatusFilters: PreOrdersStatusFilterType[] = [
  {
    id: 'all',
    name: 'Todos',
    value: '',
  },
  {
    id: 'pending',
    name: 'Pendientes',
    value: 'pending',
  },
  {
    id: 'accepted',
    name: 'Aceptados',
    value: 'accepted',
  },
  {
    id: 'rejected',
    name: 'Rechazados',
    value: 'rejected',
  },
  {
    id: 'partialyAccepted',
    name: 'Parcialmente Aceptados',
    value: 'partialy-accepted',
  },
];

type PreOrdersPaginationState = {
  page: number;
  statusFilter: PreOrdersStatusFilterType;
  sort: PreOrdersSortOptionsType;
  setPage: (number: number) => void;
  getPage: () => number;
  setStatusFilter: (filter: PreOrdersStatusFilterType) => void;
  setSort: (sort: PreOrdersSortOptionsType) => void;
};

const UsePreOrdersPaginationState = create<PreOrdersPaginationState>(
  (set, get) => ({
    page: 1,
    statusFilter: preOrdersStatusFilters[0],
    sort: preOrdersSortOptions[0],

    setPage: (page: number) => set(() => ({ page })),
    getPage: () => get().page,

    setStatusFilter: (statusFilter: PreOrdersStatusFilterType) =>
      set(() => ({ statusFilter })),

    setSort: (sort: PreOrdersSortOptionsType) => set(() => ({ sort })),
  })
);

export default UsePreOrdersPaginationState;

// Provider Pre-Orders Pagination Store
type ProviderPreOrdersPaginationState = {
  page: number;
  statusFilter: PreOrdersStatusFilterType;
  sort: PreOrdersSortOptionsType;
  setPage: (number: number) => void;
  getPage: () => number;
  setStatusFilter: (filter: PreOrdersStatusFilterType) => void;
  setSort: (sort: PreOrdersSortOptionsType) => void;
};

const UseProviderPreOrdersPaginationState =
  create<ProviderPreOrdersPaginationState>((set, get) => ({
    page: 1,
    statusFilter: preOrdersStatusFilters[0],
    sort: preOrdersSortOptions[0],

    setPage: (page: number) => set(() => ({ page })),
    getPage: () => get().page,

    setStatusFilter: (statusFilter: PreOrdersStatusFilterType) => {
      console.log('Setting status filter:', statusFilter);
      set(() => ({ statusFilter }));
    },

    setSort: (sort: PreOrdersSortOptionsType) => {
      console.log('Setting sort:', sort);
      set(() => ({ sort }));
    },
  }));

export { UseProviderPreOrdersPaginationState };
