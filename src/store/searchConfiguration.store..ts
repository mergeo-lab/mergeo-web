import { ReplacementCriteria } from '@/lib/constants';
import { BranchesSchemaType, LatLngLiteralType } from '@/lib/schemas';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type PickUpLocationArea = {
  radius: number;
  location: LatLngLiteralType;
};

type SearchConfigState = {
  searchParams: { name: string; brand: string; branchId: string };
  deliveryTime: DateRange;
  branch: BranchesSchemaType | null;
  pickUp: boolean;
  pickUpDialog: boolean;
  pickUpLocation: PickUpLocationArea;
  replacementCriteria: ReplacementCriteria;
  listId: string;
  compulsa: boolean;
  requiredFields: Array<keyof SearchConfigState>;
  isValid: boolean;
  configDialogOpen: boolean;
  configDataSubmitted: boolean;
  shouldResetConfig: boolean;
  setSearchParams: (params: {
    name?: string;
    brand?: string;
    branchId?: string;
  }) => void;
  setShouldResetConfig: (value: boolean) => void;
  setConfigDataSubmitted: (value: boolean) => void;
  setConfigDialogOpen: (open: boolean) => void;
  selectList: (listId: string) => void;
  removeList: () => void;
  setDeliveryTime: (date: DateRange) => void;
  setBranch: (branch: BranchesSchemaType) => void;
  setPickUp: () => void;
  setPickUpDialog: (turnOn?: boolean) => void;
  setPickUpLocation: (location: PickUpLocationArea) => void;
  setReplacementCriteria: (criteria: ReplacementCriteria) => void;
  setCompulsa: (value: boolean) => void;
  validateFields: () => void;
  getConfigDone: () => boolean;
  getAllConfig: () => Pick<
    SearchConfigState,
    | 'deliveryTime'
    | 'branch'
    | 'pickUp'
    | 'pickUpLocation'
    | 'replacementCriteria'
    | 'listId'
    | 'compulsa'
  >;

  resetConfig: () => void; // New reset function
};

const UseSearchConfigStore = create<SearchConfigState>((set, get) => ({
  searchParams: { name: '', brand: '', branchId: '' },
  configDialogOpen: false,
  deliveryTime: { from: new Date(), to: addDays(new Date(), 1) },
  branch: null,
  pickUp: false,
  pickUpDialog: false,
  pickUpLocation: {
    radius: 0,
    location: {
      latitude: 0,
      longitude: 0,
    },
  },
  replacementCriteria: ReplacementCriteria.BEST_PRICE_SAME_UNIT,
  listId: '',
  compulsa: false,
  requiredFields: ['deliveryTime', 'branch'],
  isValid: false,
  configDataSubmitted: false,
  shouldResetConfig: false,

  setSearchParams: (params: {
    name?: string;
    brand?: string;
    branchId?: string;
  }) => {
    set((state) => ({
      searchParams: {
        name: params.name ?? state.searchParams.name,
        brand: params.brand ?? state.searchParams.brand,
        branchId: params.branchId ?? state.searchParams.branchId,
      },
    }));
  },

  setShouldResetConfig: (value: boolean) => {
    set(() => ({ shouldResetConfig: value }));
  },

  setConfigDialogOpen: (open: boolean) => {
    set(() => ({ configDialogOpen: open }));
  },

  selectList: (listId) => {
    set({ listId });
    get().validateFields();
  },

  removeList: () => {
    set({ listId: '' });
    get().validateFields();
  },

  setDeliveryTime: (range: DateRange) => {
    set({ deliveryTime: range });
    get().validateFields();
  },

  setBranch: (branch: BranchesSchemaType) => {
    set({ branch: branch });
    get().validateFields();
  },

  setPickUpDialog: (turnOn?: boolean) => {
    if (turnOn) {
      set(() => ({ pickUpDialog: true }));
    } else {
      set((state) => ({ pickUpDialog: !state.pickUpDialog }));
    }
  },

  setPickUp: () => {
    set((state) => ({ pickUp: !state.pickUp }));
    get().validateFields();
  },

  setPickUpLocation: (location: PickUpLocationArea) => {
    set({ pickUpLocation: location });
    get().validateFields();
  },

  setReplacementCriteria: (criteria: ReplacementCriteria) => {
    set({ replacementCriteria: criteria });
    get().validateFields();
  },

  setCompulsa: (value: boolean) => set({ compulsa: value }),

  // Validation function to check required fields
  validateFields: () => {
    const { requiredFields } = get();
    const isValid = requiredFields.every((field) => {
      const value = get()[field];
      return value !== null && value !== '' && value !== undefined;
    });
    set({ isValid });
  },

  setConfigDataSubmitted: (value: boolean) =>
    set(() => ({ configDataSubmitted: value })),

  getConfigDone: () => {
    return get().isValid;
  },

  getAllConfig: () => {
    const {
      deliveryTime,
      branch,
      pickUp,
      pickUpLocation,
      replacementCriteria,
      listId,
      compulsa,
    } = get();
    return {
      branch,
      deliveryTime,
      pickUp,
      pickUpLocation,
      replacementCriteria,
      listId,
      compulsa,
    };
  },

  // Reset function to clear all saved data
  resetConfig: () =>
    set({
      searchParams: { name: '', brand: '', branchId: '' },
      configDialogOpen: true,
      deliveryTime: { from: new Date(), to: addDays(new Date(), 1) },
      branch: null,
      pickUp: false,
      pickUpLocation: {
        radius: 0,
        location: {
          latitude: 0,
          longitude: 0,
        },
      },
      replacementCriteria: ReplacementCriteria.BEST_PRICE_SAME_UNIT,
      listId: '',
      compulsa: false,
      isValid: false,
      configDataSubmitted: false,
    }),
}));

export default UseSearchConfigStore;
