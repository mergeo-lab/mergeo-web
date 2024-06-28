import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type RegistrationState = {
  companyId: string | null;
  accountType: string | null;
  userEmail: string | null;
  // eslint-disable-next-line no-unused-vars
  saveCompanyId: (companyId: string) => void;
  saveAccountType: (accoutType: string) => void;
  saveUserEmail: (userEmail: string) => void;
};
const UseRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      companyId: null,
      accountType: null,
      userEmail: null,
      saveCompanyId: (companyId: string) => set(() => ({ companyId })),
      saveAccountType: (accountType: string) => set(() => ({ accountType })),
      saveUserEmail: (userEmail: string) => set(() => ({ userEmail })),
    }),
    { name: 'registrationStore' }
  )
);

export const removeRegistrationStore = () =>
  UseRegistrationStore.persist.clearStorage();

export default UseRegistrationStore;
