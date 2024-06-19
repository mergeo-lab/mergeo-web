import { RegisterCompanySchemaType } from '@/lib/auth/schema';
import { create } from 'zustand';

type CompanyState = {
  company: RegisterCompanySchemaType | null;
  // eslint-disable-next-line no-unused-vars
  saveCompany: (user: RegisterCompanySchemaType) => void;
};

export const UseCompanyStore = create<CompanyState>()((set) => ({
  company: null,
  saveCompany: (company: RegisterCompanySchemaType) => set(() => ({ company })),
}));

export default UseCompanyStore;
