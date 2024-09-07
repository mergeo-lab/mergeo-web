import { CompanySchemaType } from '@/lib/configuration/schemas';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CompanyStore = {
  company: CompanySchemaType | null;
  // eslint-disable-next-line no-unused-vars
  saveCompany: (company: CompanySchemaType) => void;
};

const UseCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      company: null,
      saveCompany: (company: CompanySchemaType) => set(() => ({ company })),
    }),
    { name: 'companyStore' }
  )
);
export const removeCompany = () => UseCompanyStore.persist.clearStorage();

export default UseCompanyStore;
