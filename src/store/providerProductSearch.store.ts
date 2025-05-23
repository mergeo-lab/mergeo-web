// src/store/productSearch.store.ts
import { create } from 'zustand';
import { NewProductSearchType } from '@/lib/schemas';

interface ProviderProductSearchStore {
  params: NewProductSearchType | null;
  setParams: (params: NewProductSearchType) => void;
  resetParams: () => void;
}

export const useProviderProductSearchStore = create<ProviderProductSearchStore>(
  (set) => ({
    params: null,
    setParams: (params) => set({ params }),
    resetParams: () => set({ params: null }),
  })
);
