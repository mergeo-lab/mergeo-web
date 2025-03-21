import { create } from 'zustand';

type MorePresentations = {
  selectedProductId: string | null;
  sheetOpen: boolean;
  setSelectedProductId: (id: string) => void;
  toggleSheetOpen: (productId: string | null) => void;
};

const UseMorePresentations = create<MorePresentations>((set) => ({
  selectedProductId: '',
  sheetOpen: false,

  setSelectedProductId: (productId: string) => {
    set({ selectedProductId: productId });
  },

  toggleSheetOpen: (productId: string | null) => {
    set((state) => ({
      sheetOpen: !state.sheetOpen,
      selectedProductId: productId,
    }));
  },
}));

export default UseMorePresentations;
