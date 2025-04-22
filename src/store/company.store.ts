import { CompanySchemaType } from '@/lib/schemas';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CompanyStore = {
  company: CompanySchemaType | null;
  saveCompany: (company: CompanySchemaType) => void;
  updateCompany: (updates: Partial<CompanySchemaType>) => void;
  getCompanyId: () => string;
};

const UseCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      company: null,
      saveCompany: (company: CompanySchemaType) => set(() => ({ company })),
      updateCompany: (updates: Partial<CompanySchemaType>) =>
        set((state) => ({
          company: state.company ? { ...state.company, ...updates } : null,
        })),
      getCompanyId: () => get().company?.id ?? '',
    }),
    { name: 'companyStore' }
  )
);

export const removeCompany = () => UseCompanyStore.persist.clearStorage();

export default UseCompanyStore;
