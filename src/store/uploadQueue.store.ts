import { create } from 'zustand';

export type UploadQueueItem = {
  id: string;
  fileName: string;
};

type UploadQueueStore = {
  queue: UploadQueueItem[];
  finished: UploadQueueItem[];
  addToQueue: (item: UploadQueueItem) => void;
  addToFinished: (id: string) => void;
  resetQueue: () => void;
  removeFromQueue: (id: string) => void;
  removeFinishedFromQueue: () => void;
};

export const useUploadQueue = create<UploadQueueStore>((set) => ({
  queue: [],
  finished: [],
  addToQueue: (item) =>
    set((state) => ({
      queue: state.queue.find((q) => q.id === item.id)
        ? state.queue
        : [...state.queue, item],
    })),
  resetQueue: () => set(() => ({ queue: [], finished: [] })),
  addToFinished: (id) =>
    set((state) => ({
      finished: [...state.finished, ...state.queue.filter((q) => q.id === id)],
    })),
  removeFinishedFromQueue: () =>
    set((state) => {
      const finishedIds = state.finished.map((f) => f.id);
      const newQueue = state.queue.filter((q) => !finishedIds.includes(q.id));
      return {
        queue: newQueue,
      };
    }),
  removeFromQueue: (id) =>
    set((state) => {
      const newQueue = state.queue.filter((q) => q.id !== id);
      return {
        queue: newQueue,
      };
    }),
}));
