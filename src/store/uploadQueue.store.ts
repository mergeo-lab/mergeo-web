import { create } from 'zustand';

type UploadQueueStore = {
  queue: Set<string>;
  addToQueue: (fileName: string) => void;
  resetQueue: () => void;
  removeFromQueue: (fileName: string) => void;
};

export const useUploadQueue = create<UploadQueueStore>((set) => ({
  queue: new Set<string>(),
  addToQueue: (fileName) =>
    set((state) => ({
      queue: new Set([...state.queue, fileName]),
    })),
  resetQueue: () => set({ queue: new Set<string>() }),
  removeFromQueue: (fileName) =>
    set((state) => ({
      queue: new Set([...state.queue].filter((file) => file !== fileName)),
    })),
}));
