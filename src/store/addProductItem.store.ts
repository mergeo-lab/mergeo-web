import { create } from 'zustand';

export type AddProduct = {
  id: string;
  name: string;
  brand: string;
  netContent: number;
  measurmentUnit: string;
  price?: number; // Optional initially
};

type ProductStore = {
  products: Record<string, AddProduct>;
  addProduct: (product: AddProduct) => void;
  updateProduct: (id: string, price: number) => void;
  removeProduct: (id: string) => void;
  getProduct: (id: string) => AddProduct | undefined;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: {},
  addProduct: (product) =>
    set((state) => ({
      products: {
        ...state.products,
        [product.id]: product,
      },
    })),
  updateProduct: (id, price) =>
    set((state) => ({
      products: {
        ...state.products,
        [id]: {
          ...state.products[id],
          price, // Update price of only the specified product
        },
      },
    })),
  removeProduct: (id) =>
    set((state) => {
      const { [id]: _, ...remainingProducts } = state.products;
      return { products: remainingProducts };
    }),
  getProduct: (id) => get().products[id],
}));
