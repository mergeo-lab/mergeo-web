import { CompanySchemaType } from '@/lib/configuration/schema';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UseCompanyStore = {
  company: CompanySchemaType | null;
  // eslint-disable-next-line no-unused-vars
  saveCompany: (company: CompanySchemaType) => void;
};

const UseCompanyStore = create<UseCompanyStore>()(
  persist(
    (set) => ({
      company: null,
      saveCompany: (company: CompanySchemaType) => set(() => ({ company })),
    }),
    { name: 'companyStore' }
  )
);
export const removeUser = () => UseCompanyStore.persist.clearStorage();

export default UseCompanyStore;
