import { create } from 'zustand';

type GlobalLoadingStore = {
  visible: boolean;
  label?: string;
  show: (label?: string) => void;
  hide: () => void;
};

export const useGlobalLoading = create<GlobalLoadingStore>((set) => ({
  visible: false,
  label: undefined,
  show: (label) => set({ visible: true, label }),
  hide: () => set({ visible: false, label: undefined }),
}));
