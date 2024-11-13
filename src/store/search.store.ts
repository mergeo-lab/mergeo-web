import { SearchListProductType } from '@/lib/schemas';
import { create } from 'zustand';

type SearchState = {
  activeSearchItem: SearchListProductType | null;
  setActiveSearchItem: (item: SearchListProductType) => void;
};

const UseSearchStore = create<SearchState>((set) => ({
  activeSearchItem: null,
  setActiveSearchItem: (item: SearchListProductType) =>
    set({ activeSearchItem: item }),
}));

export default UseSearchStore;
