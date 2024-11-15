import { SearchListProductType } from '@/lib/schemas';
import { create } from 'zustand';

type SavedProducts = {
  [key: string]: ProductWithQuantity[];
};

export type ProductWithQuantity = CartProduct & {
  quantity: number;
};

export type CartProduct = {
  id: string;
  name: string;
  measurementUnit: string;
  unitConversionFactor: number;
  price: string;
  providerId: string;
  brand: string;
  description?: string;
  variety?: string;
  net_content?: number;
  segment?: string;
  family?: string;
  image?: string;
  units?: number;
  manufacturer_name?: string;
  manufacturer_id?: string;
  manufacturer_country?: string;
};

type SearchState = {
  activeSearchItem: SearchListProductType | null;
  savedProducts: SavedProducts;
  setActiveSearchItem: (item: SearchListProductType | null) => void;
  saveProduct: (product: CartProduct, quantity: number) => void;
  removeProduct: (productId: string, providerId: string) => void;
  getAllSavedProducts: () => ProductWithQuantity[];
  reset: () => void;
};
const UseSearchStore = create<SearchState>((set, get) => ({
  activeSearchItem: null,
  savedProducts: {},

  setActiveSearchItem: (item: SearchListProductType | null) =>
    set({ activeSearchItem: item }),

  saveProduct: (product: CartProduct, quantity: number) => {
    const { activeSearchItem, savedProducts } = get();

    // Use the active search ID or default to a "generic" list
    const activeSearchId = activeSearchItem?.id || 'default';
    const productsArray = savedProducts[activeSearchId] || [];

    // Check if the product already exists
    const existingProductIndex = productsArray.findIndex(
      (p) => p.id === product.id && p.providerId === product.providerId
    );

    if (existingProductIndex > -1) {
      // Update quantity if the product already exists
      productsArray[existingProductIndex].quantity = quantity;
    } else {
      // Add new product with its quantity
      const updatedProduct: ProductWithQuantity = { ...product, quantity };
      productsArray.push(updatedProduct);
    }

    set({
      savedProducts: {
        ...savedProducts,
        [activeSearchId]: [...productsArray],
      },
    });
  },

  removeProduct: (productId: string, providerId: string) => {
    const { activeSearchItem, savedProducts } = get();

    // Use the active search ID or default to "generic"
    const activeSearchId = activeSearchItem?.id || 'default';
    const productsArray = savedProducts[activeSearchId] || [];

    // Filter out the product with the matching id and providerId
    const updatedProductsArray = productsArray.filter(
      (p) => !(p.id === productId && p.providerId === providerId)
    );

    set({
      savedProducts: {
        ...savedProducts,
        [activeSearchId]: updatedProductsArray,
      },
    });
  },

  getAllSavedProducts: () => {
    const { savedProducts } = get();
    // Flatten the arrays from all entries into a single array
    return Object.values(savedProducts).flat();
  },

  reset: () => set({ savedProducts: {}, activeSearchItem: null }),
}));

export default UseSearchStore;
