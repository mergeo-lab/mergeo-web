import { create } from 'zustand';
import { PreOrderProductDetailSchemaType } from '@/lib/schemas/index';

export type AddProduct = PreOrderProductDetailSchemaType;

type ProductStore = {
  products: AddProduct[];
  addProduct: (product: AddProduct) => void;
  updateProduct: (gtin: string, price: string) => void;
  removeProduct: (gtin: string) => void;
  removeAllProducts: () => void;
  getProduct: (gtin: string) => AddProduct | undefined;
  getAllProducts: () => AddProduct[];
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  updateProduct: (gtin, price) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.gtin === gtin ? { ...product, price } : product
      ),
    })),
  removeProduct: (gtin) =>
    set((state) => ({
      products: state.products.filter((product) => product.gtin !== gtin),
    })),
  removeAllProducts: () => set(() => ({ products: [] })),
  getProduct: (gtin) => get().products.find((product) => product.gtin === gtin),
  getAllProducts: () => get().products,
}));
