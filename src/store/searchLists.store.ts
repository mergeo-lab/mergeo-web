import { create } from 'zustand';
import {
  SearchListsResultsType,
  SearchListProductType,
} from '@/lib/searchLists/searchLists.schemas';

type SearchListsState = {
  lists: SearchListsResultsType[];
  selectedList: SearchListsResultsType | null;
  categoriesFromList: string[] | null;
  addList: (list: SearchListsResultsType) => void;
  editList: (id: string, updatedList: Partial<SearchListsResultsType>) => void;
  addMultipleLists: (newLists: SearchListsResultsType[]) => void;
  removeList: (id: string) => void;
  addProductToList: (listId: string, product: SearchListProductType) => void;
  removeProductFromList: (listId: string, productId: string) => void;
  removeAllLists: () => void;
  deleteProduct: (productId: string) => void;
  getListById: (id: string) => SearchListsResultsType | undefined;
  getAllListsNames: () => { name: string; id: string }[];
  searchProductById: (productId: string) => SearchListProductType | undefined;
  setSelectedList: (list: SearchListsResultsType | null) => void;
  getCategoriesFromSelectedList: () => void;
  removeCategoriesFromList: () => void; // Function to remove a category
};

const UseSearchListsStore = create<SearchListsState>((set, get) => ({
  lists: [],
  selectedList: null,
  categoriesFromList: null,

  addList: (list) =>
    set((state) => ({
      lists: [...state.lists, list],
    })),

  addMultipleLists: (newLists: SearchListsResultsType[]) =>
    set((state) => ({
      lists: [...state.lists, ...newLists],
    })),

  editList: (id, updatedList) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === id ? { ...list, ...updatedList } : list
      ),
    })),

  removeList: (id) =>
    set((state) => ({
      lists: state.lists.filter((list) => list.id !== id),
    })),

  removeAllLists: () =>
    set(() => ({
      lists: [],
    })),

  addProductToList: (listId, product) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? { ...list, products: [...list.products, product] }
          : list
      ),
    })),

  removeProductFromList: (listId, productId) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              products: list.products.filter(
                (product) => product.id !== productId
              ),
            }
          : list
      ),
    })),

  deleteProduct: (productId) =>
    set((state) => ({
      lists: state.lists.map((list) => ({
        ...list,
        products: list.products.filter((product) => product.id !== productId),
      })),
    })),

  getListById: (id) => get().lists.find((list) => list.id === id),

  getAllListsNames: () =>
    get().lists.map((list) => {
      return { name: list.name, id: list.id };
    }),

  searchProductById: (productId) =>
    get()
      .lists.flatMap((list) => list.products)
      .find((product) => product.id === productId),

  setSelectedList: (list) => set({ selectedList: list }),

  getCategoriesFromSelectedList: () => {
    const { selectedList } = get();

    if (!selectedList) return [];

    const categories = selectedList.products
      .map((product) => product.category)
      .filter((category): category is string => !!category);

    set({ categoriesFromList: Array.from(new Set(categories)) });
  },

  removeCategoriesFromList: () => set({ categoriesFromList: null }),
}));

export default UseSearchListsStore;
