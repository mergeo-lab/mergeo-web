import { create } from 'zustand';

export type BuyOrdersSortOptionsType = {
  id: string;
  name: string;
  sortOrder: 'ASC' | 'DESC';
};

export const buyOrdersSortOptions: BuyOrdersSortOptionsType[] = [
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

export type BuyOrdersViewedFilterType = {
  id: string;
  name: string;
  value: boolean | undefined;
};

export const buyOrdersViewedFilters: BuyOrdersViewedFilterType[] = [
  {
    id: 'all',
    name: 'Todos',
    value: undefined,
  },
  {
    id: 'viewed',
    name: 'Vistos',
    value: true,
  },
  {
    id: 'not-viewed',
    name: 'No Vistos',
    value: false,
  },
];

type BuyOrdersPaginationState = {
  page: number;
  viewedFilter: BuyOrdersViewedFilterType;
  sort: BuyOrdersSortOptionsType;
  setPage: (number: number) => void;
  getPage: () => number;
  setViewedFilter: (filter: BuyOrdersViewedFilterType) => void;
  setSort: (sort: BuyOrdersSortOptionsType) => void;
};

const UseBuyOrdersPaginationState = create<BuyOrdersPaginationState>(
  (set, get) => ({
    page: 1,
    viewedFilter: buyOrdersViewedFilters[0],
    sort: buyOrdersSortOptions[0],

    setPage: (page: number) => set(() => ({ page })),
    getPage: () => get().page,

    setViewedFilter: (viewedFilter: BuyOrdersViewedFilterType) =>
      set(() => ({ viewedFilter })),

    setSort: (sort: BuyOrdersSortOptionsType) => set(() => ({ sort })),
  })
);

export default UseBuyOrdersPaginationState;
