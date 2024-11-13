import { ReplacementCriteria } from '@/lib/constants';
import { BranchesSchemaType, LatLngLiteralType } from '@/lib/schemas';
import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type PickUpLocationArea = {
  radius: number;
  location: LatLngLiteralType;
};

type SearchConfigState = {
  deliveryTime: DateRange;
  branch: BranchesSchemaType | null;
  pickUp: boolean;
  pickUpLocation: PickUpLocationArea;
  replacementCriteria: ReplacementCriteria;
  listId: string;
  compulsa: boolean;
  requiredFields: Array<keyof SearchConfigState>;
  isValid: boolean;
  selectList: (listId: string) => void;
  removeList: () => void;
  setDeliveryTime: (date: DateRange) => void;
  setBranch: (branch: BranchesSchemaType) => void;
  setPickUp: () => void;
  setPickUpLocation: (location: PickUpLocationArea) => void;
  setReplacementCriteria: (criteria: ReplacementCriteria) => void;
  setCompulsa: (value: boolean) => void;
  validateFields: () => void;
  getAllConfig: () => Omit<
    SearchConfigState,
    | 'requiredFields'
    | 'isValid'
    | 'selectList'
    | 'removeList'
    | 'setDeliveryTime'
    | 'setBranch'
    | 'setPickUp'
    | 'setPickUpLocation'
    | 'setReplacementCriteria'
    | 'setCompulsa'
    | 'validateFields'
    | 'getAllConfig'
  >;
};

const UseSearchConfigStore = create<SearchConfigState>((set, get) => ({
  deliveryTime: { from: new Date(), to: new Date() },
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
  requiredFields: ['deliveryTime', 'branch'],
  isValid: false,

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
      deliveryTime,
      branch,
      pickUp,
      pickUpLocation,
      replacementCriteria,
      listId,
      compulsa,
    };
  },
}));

export default UseSearchConfigStore;
