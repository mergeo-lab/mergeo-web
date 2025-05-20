import { create } from 'zustand';

type UploadQueueStore = {
  queue: string[];
  finished: string[];
  addToQueue: (fileName: string) => void;
  addToFinished: (fileName: string) => void;
  resetQueue: () => void;
  removeFromQueue: (fileName: string) => void;
  removeFinishedFromQueue: () => void;
};

export const useUploadQueue = create<UploadQueueStore>((set) => ({
  queue: [],
  finished: [],
  addToQueue: (fileName) =>
    set((state) => ({
      queue: state.queue.includes(fileName)
        ? state.queue
        : [...state.queue, fileName],
    })),
  resetQueue: () => [],
  addToFinished: (fileName) =>
    set((state) => ({
      finished: [...state.finished, fileName],
    })),
  removeFinishedFromQueue: () =>
    set((state) => {
      const newQueue = state.queue.filter(
        (file) => !state.finished.includes(file)
      );
      return {
        queue: newQueue,
      };
    }),
  removeFromQueue: (fileName) =>
    set((state) => {
      const newQueue = state.queue.filter((file) => file !== fileName);
      return {
        queue: newQueue,
      };
    }),
}));
