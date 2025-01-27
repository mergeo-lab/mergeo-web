import { create } from 'zustand';
import { PreOrderProductDetailSchemaType } from '@/lib/schemas/index';

export type AddProduct = PreOrderProductDetailSchemaType & { id: string };

type ProductStore = {
  products: AddProduct[];
  addProduct: (product: AddProduct) => void;
  updateProduct: (id: string, price: string) => void;
  removeProduct: (id: string) => void;
  getProduct: (id: string) => AddProduct | undefined;
  getAllProducts: () => AddProduct[];
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  updateProduct: (id, price) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, price } : product
      ),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  getProduct: (id) => get().products.find((product) => product.id === id),
  getAllProducts: () => get().products,
}));
