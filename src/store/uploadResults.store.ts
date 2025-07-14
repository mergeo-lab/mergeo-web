import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UploadResult = {
  fileName: string;
  timestamp: number;
  successGtins?: string[];
  failedGtins?: string[];
  [key: string]: unknown;
};

type UploadResultsStore = {
  results: Record<string, UploadResult>;
  addResult: (fileName: string, result: UploadResult) => void;
  removeResult: (key: string) => void;
  clearResults: () => void;
};

export const useUploadResultsStore = create<UploadResultsStore>()(
  persist(
    (set) => ({
      results: {},
      addResult: (fileName, result) =>
        set((state) => {
          const key = `${fileName}_${result.timestamp}`;
          return {
            results: {
              ...state.results,
              [key]: result,
            },
          };
        }),
      removeResult: (key) =>
        set((state) => {
          const newResults = { ...state.results };
          delete newResults[key];
          return { results: newResults };
        }),
      clearResults: () => set({ results: {} }),
    }),
    {
      name: 'upload-results-storage',
    }
  )
);
