import { BranchesSchemaType } from '@/lib/configuration/schemas';
import { create } from 'zustand';

type BranchesStore = {
  branches: BranchesSchemaType[];
  addBranch: (branch: BranchesSchemaType) => void;
  addBranches: (branches: BranchesSchemaType[]) => void;
  removeBranch: (id: string) => void;
  removeAllBranches: () => void;
};

const UseBranchesStore = create<BranchesStore>((set) => ({
  branches: [],
  addBranch: (branch) =>
    set((state) => {
      if (
        !state.branches.some(
          (existingBranch) => existingBranch.id === branch.id
        )
      ) {
        return {
          branches: [...state.branches, branch],
        };
      }
      return state;
    }),
  removeBranch: (id) =>
    set((state) => ({
      branches: state.branches.filter((branch) => branch.id !== id),
    })),
  addBranches: (branches) => set({ branches }),
  removeAllBranches: () =>
    set(() => ({
      branches: [],
    })),
}));

export default UseBranchesStore;
