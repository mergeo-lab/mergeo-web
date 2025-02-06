import { ProductsFormFinderType } from '@/lib/schemas';
import { create } from 'zustand';

export type SortOptionsType = {
  id: string;
  name: string;
  sort: 'asc' | 'desc';
};

export const sortOptions: SortOptionsType[] = [
  {
    id: 'name',
    name: 'Nombre',
    sort: 'asc',
  },
  {
    id: 'brand',
    name: 'Marca',
    sort: 'asc',
  },
  {
    id: 'updated',
    name: 'Fecha',
    sort: 'desc',
  },
];

type ProviderInventoryPaginationState = {
  page: number;
  search: ProductsFormFinderType;
  sort: SortOptionsType;
  setPage: (number: number) => void;
  getPage: () => number;
  setSearch: (search: ProductsFormFinderType) => void;
  setSort: (sort: SortOptionsType) => void;
};

const UseProviderInventoryPaginationState =
  create<ProviderInventoryPaginationState>((set, get) => ({
    page: 1,
    search: {},
    sort: sortOptions[0],

    setPage: (page: number) => set(() => ({ page })),
    getPage: () => get().page,

    setSearch: (search: ProductsFormFinderType) => set(() => ({ search })),

    setSort: (sort: SortOptionsType) => set(() => ({ sort })),
  }));

export default UseProviderInventoryPaginationState;
