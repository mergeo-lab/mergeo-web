import { UserType } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
  user: UserType | null;
  // eslint-disable-next-line no-unused-vars
  saveUser: (user: UserType) => void;
};

const UseUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      saveUser: (user: UserType) => set(() => ({ user })),
    }),
    { name: 'userStore' }
  )
);
export const removeUser = () => UseUserStore.persist.clearStorage();

export default UseUserStore;
