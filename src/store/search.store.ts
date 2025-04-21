import { ProductSchemaType, SearchListProductType } from '@/lib/schemas';
import { create } from 'zustand';

type SavedProducts = {
  [key: string]: ProductWithQuantity[];
};

export type CartProductQuantity = Pick<
  ProductWithQuantity,
  'id' | 'providerId' | 'quantity'
>;

export type CartProduct = ProductSchemaType & {
  providerId: string;
  dropZoneId: string;
};

export type ProductWithQuantity = CartProduct & {
  quantity: number;
};

type SearchState = {
  activeSearchItem: SearchListProductType | null;
  savedProducts: SavedProducts;
  morePresentations: string[]; // Add this property to hold the morePresentations array
  setActiveSearchItem: (item: SearchListProductType | null) => void;
  saveProduct: (product: CartProduct, quantity: number) => void;
  saveMorePresentations: (morePresentations: string[]) => void;
  removeProduct: (productId: string) => void;
  getSavedProductById: (id: string) => ProductWithQuantity | undefined;
  getAllSavedProducts: () => ProductWithQuantity[];
  reset: () => void;
};
const UseSearchStore = create<SearchState>((set, get) => ({
  activeSearchItem: null,
  morePresentations: [],
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

  saveMorePresentations: (morePresentations: string[]) =>
    set({ morePresentations }),

  removeProduct: (productId: string) => {
    const { activeSearchItem, savedProducts } = get();

    // Use the active search ID or default to "generic"
    const activeSearchId = activeSearchItem?.id || 'default';
    const productsArray = savedProducts[activeSearchId] || [];

    // Filter out the product with the matching id and providerId
    const updatedProductsArray = productsArray.filter(
      (p) => !(p.id === productId)
    );

    set({
      savedProducts: {
        ...savedProducts,
        [activeSearchId]: updatedProductsArray,
      },
    });
  },

  getSavedProductById: (id: string): ProductWithQuantity | undefined => {
    const { savedProducts } = get();
    return Object.values(savedProducts)
      .flat()
      .find((p) => p.id === id);
  },

  getAllSavedProducts: () => {
    const { savedProducts } = get();
    // Flatten the arrays from all entries into a single array
    return Object.values(savedProducts).flat();
  },

  reset: () => set({ savedProducts: {}, activeSearchItem: null }),
}));

export default UseSearchStore;
