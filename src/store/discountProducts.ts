import { create } from 'zustand';

type DiscountProducts = {
  products: string[];
  addProduct: (product: string) => void;
  toggleAllProducts: (products: string[]) => void;
  removeAllProducts: () => void;
  removeProduct: (id: string) => void;
  getProductById: (id: string) => string | undefined;
  isAdded: (id: string) => boolean;
};

const UseDiscountProductsStore = create<DiscountProducts>((set, get) => ({
  products: [],
  addProduct: (product: string) => {
    set({
      products: [...get().products, product],
    });
  },
  toggleAllProducts: (products: string[]) => {
    set({
      products: get().products.length > 0 ? [] : products,
    });
  },
  removeAllProducts: () => {
    set({
      products: [],
    });
  },
  removeProduct: (id: string) => {
    set({
      products: get().products.filter((p) => p !== id),
    });
  },
  getProductById: (id: string) => {
    return get().products.find((p) => p === id);
  },
  isAdded: (id: string) => {
    return get().products.includes(id);
  },
}));

export default UseDiscountProductsStore;
