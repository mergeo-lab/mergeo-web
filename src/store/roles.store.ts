import { RoleSchemaType } from '@/lib/schemas';
import { create } from 'zustand';

type RoleState = {
  roles: RoleSchemaType[];
  allRoles: RoleSchemaType[];
  addRole: (role: RoleSchemaType) => void;
  addRoles: (roles: RoleSchemaType[]) => void;
  removeRole: (id: string) => void;
  removeAllRoles: () => void;
  setAllCompanyRoles: (roles: RoleSchemaType[]) => void;
  addCompanyRole: (role: RoleSchemaType) => void;
  removeCompanyRole: (id: string) => void;
};

const UseRoleStore = create<RoleState>((set) => ({
  roles: [],
  allRoles: [],
  addRole: (role) =>
    set((state) => {
      if (!state.roles.some((existingRole) => existingRole.id === role.id)) {
        return {
          roles: [...state.roles, role],
        };
      }
      return state;
    }),
  addRoles: (roles) => set({ roles }),
  removeRole: (id) =>
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== id),
    })),
  removeAllRoles: () =>
    set(() => ({
      roles: [],
    })),
  setAllCompanyRoles: (allRoles) => set({ allRoles }),
  addCompanyRole: (role) =>
    set((state) => {
      if (!state.allRoles.some((existingRole) => existingRole.id === role.id)) {
        return {
          allRoles: [...state.allRoles, role],
        };
      }
      return state;
    }),
  removeCompanyRole: (id) =>
    set((state) => ({
      allRoles: state.allRoles.filter((role) => role.id !== id),
    })),
}));

export default UseRoleStore;
