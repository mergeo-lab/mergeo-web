import { ReplacementCriteria } from '@/lib/constants';
import { BranchesSchemaType, LatLngLiteralType } from '@/lib/schemas';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

const LOCAL_STORAGE_KEY = 'searchConfig';

const getInitialConfig = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export type PickUpLocationArea = {
  radius: number;
  location: LatLngLiteralType;
};

type SearchConfigState = {
  searchParams: { name: string; brand: string; branchId: string };
  deliveryTime: DateRange;
  branch: BranchesSchemaType | null;
  tempBranch: BranchesSchemaType | null;
  pickUp: boolean;
  showPickUp: boolean;
  pickUpDialog: boolean;
  pickUpLocation: PickUpLocationArea;
  replacementCriteria: ReplacementCriteria;
  listId: string;
  listName: string;
  compulsa: boolean;
  requiredFields: Array<keyof SearchConfigState>;
  isValid: boolean;
  configDialogOpen: boolean;
  configDataSubmitted: boolean;
  shouldResetConfig: boolean;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (value: boolean) => void;
  setSearchParams: (params: {
    name?: string;
    brand?: string;
    branchId?: string;
  }) => void;
  setShouldResetConfig: (value: boolean) => void;
  setConfigDataSubmitted: (value: boolean) => void;
  setConfigDialogOpen: (open: boolean) => void;
  selectList: (listId: string) => void;
  setListName: (name: string) => void;
  removeList: () => void;
  setDeliveryTime: (date: DateRange | undefined) => void;
  setBranch: (branch: BranchesSchemaType) => void;
  setTempBranch: (branch: BranchesSchemaType) => void;
  setPickUp: (isPickUp: boolean) => void;
  setShowPickUp: (show: boolean) => void;
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
    | 'listName'
    | 'compulsa'
  >;

  resetConfig: () => void; // New reset function
  setConfig: (config: Partial<SearchConfigState>) => void;
  clearConfig: () => void;
  hasSavedConfig: () => boolean;
  getSavedConfig: () => SearchConfigState;
};

const UseSearchConfigStore = create<SearchConfigState>((set, get) => ({
  ...getInitialConfig(),
  searchParams: { name: '', brand: '', branchId: '' },
  configDialogOpen: false,
  deliveryTime: { from: new Date(), to: addDays(new Date(), 1) },
  branch: null,
  tempBranch: null, // New temporary branch state for pick-up
  pickUp: false,
  showPickUp: false,
  pickUpDialog: false,
  pickUpLocation: {
    radius: 0,
    location: {
      latitude: 0,
      longitude: 0,
    },
  },
  replacementCriteria: ReplacementCriteria.BEST_PRICE_FOR_UNIT,
  listId: '',
  compulsa: false,
  requiredFields: ['deliveryTime', 'branch'],
  isValid: false,
  configDataSubmitted: false,
  shouldResetConfig: false,
  showOnlyFavorites: false,
  listName: '',
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

  setShowOnlyFavorites: (value: boolean) => {
    set(() => ({ showOnlyFavorites: value }));
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

  setListName: (name: string) => {
    set({ listName: name });
  },

  removeList: () => {
    set({ listId: '' });
    get().validateFields();
  },

  setDeliveryTime: (range: DateRange | undefined) => {
    set({ deliveryTime: range });
    get().validateFields();
  },

  setBranch: (branch: BranchesSchemaType) => {
    set({ branch: branch });
    get().validateFields();
  },

  setTempBranch: (branch: BranchesSchemaType) => {
    set({ tempBranch: branch });
  },

  setPickUpDialog: (turnOn?: boolean) => {
    if (turnOn) {
      set(() => ({ pickUpDialog: true }));
    } else {
      set((state) => ({ pickUpDialog: !state.pickUpDialog }));
    }
  },

  setPickUp: (isPickUp: boolean) => {
    set(() => ({ pickUp: isPickUp }));
    get().validateFields();
  },

  setShowPickUp: (show: boolean) => {
    set({ showPickUp: show });
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
      listName,
      compulsa,
    } = get();
    return {
      branch,
      deliveryTime,
      pickUp,
      pickUpLocation,
      replacementCriteria,
      listId,
      listName,
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
      replacementCriteria: ReplacementCriteria.BEST_PRICE_FOR_UNIT,
      listId: '',
      listName: '',
      compulsa: false,
      isValid: false,
      configDataSubmitted: false,
    }),

  setConfig: (config) => {
    set(config);
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ ...get(), ...config })
    );
  },

  clearConfig: () => {
    set({}); // Reset to empty or your default state
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },

  hasSavedConfig: () => !!localStorage.getItem(LOCAL_STORAGE_KEY),

  getSavedConfig: () => getInitialConfig(),
}));

export default UseSearchConfigStore;
