import { create } from 'zustand';
import { SearchListProductType } from '@/lib/searchLists/searchLists.schemas';

type SearchProductState = {
  products: SearchListProductType[];
  addProduct: (product: SearchListProductType) => void;
  removeProduct: (id: string) => void;
  removeAllProducts: () => void;
};

const UseSearchProductStore = create<SearchProductState>((set) => ({
  products: [],

  // Method to add a product
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product], // Adds the new product to the array
    })),

  // Method to remove a product by ID
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id), // Filters out the product with the matching id
    })),

  removeAllProducts: () => set({ products: [] }),
}));

export default UseSearchProductStore;
