import { ProductsListSchemaType, ProductSchemaType } from '@/lib/schemas';
import { create } from 'zustand';

type ProductListState = {
  lists: ProductsListSchemaType[];
  selectedList: ProductsListSchemaType | null;
  addList: (list: ProductsListSchemaType) => void;
  setSelectedList: (list: ProductsListSchemaType | null) => void;
  removeSelectedList: () => void;
  removeAllLists: () => void;
  reset: () => void;
  addProductToList: (listId: string, product: ProductSchemaType) => void;
  removeProductFromList: (listId: string, productId: string) => void;
  removeAllProductsFromList: (listId: string) => void;
  removeAllListsOfProducts: () => void;
};

const UseProductListStore = create<ProductListState>((set) => ({
  lists: [],
  selectedList: null,

  // Add a new list
  addList: (list) =>
    set((state) => ({
      lists: [...state.lists, list],
    })),

  // Set the selected list
  setSelectedList: (list) =>
    set(() => ({
      selectedList: list,
    })),

  // Remove the selected list
  removeSelectedList: () =>
    set(() => ({
      selectedList: null,
    })),

  // Remove all lists
  removeAllLists: () =>
    set(() => ({
      lists: [],
      selectedList: null,
    })),

  // Reset the store
  reset: () =>
    set(() => ({
      lists: [],
      selectedList: null,
    })),

  // Add a product to a specific list
  addProductToList: (listId, product) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? { ...list, products: [...list.products, product] }
          : list
      ),
    })),

  // Remove a product from a specific list
  removeProductFromList: (listId, productId) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              products: list.products.filter((p) => p.id !== productId),
            }
          : list
      ),
    })),

  // Remove all products from a specific list
  removeAllProductsFromList: (listId) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId ? { ...list, products: [] } : list
      ),
    })),

  // Remove all lists of products
  removeAllListsOfProducts: () =>
    set((state) => ({
      lists: state.lists.map((list) => ({
        ...list,
        products: [],
      })),
    })),
}));

export default UseProductListStore;
