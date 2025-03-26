import { create } from 'zustand';

type MorePresentations = {
  openProductId: string | null;
  toggleSheetOpen: (productId: string | null) => void;
};

const UseMorePresentations = create<MorePresentations>((set) => ({
  openProductId: null as string | null,
  toggleSheetOpen: (productId: string | null) =>
    set((state) => ({
      openProductId: state.openProductId === productId ? null : productId,
    })),
}));

export default UseMorePresentations;
