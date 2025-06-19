import { ProductSchemaType, SearchListProductType } from '@/lib/schemas';
import { create } from 'zustand';

type SavedProducts = {
  [key: string]: ProductWithQuantity[];
};

export type CartProductQuantity = Pick<
  ProductWithQuantity,
  'id' | 'providerId' | 'quantity' | 'price' | 'segment'
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
    console.log('[saveProduct] called with:', product, quantity);
    // Use the active search ID or default to a "generic" list
    const activeSearchId = activeSearchItem?.id || 'default';
    console.log('[saveProduct] activeSearchId:', activeSearchId);
    console.log('[saveProduct] Current savedProducts:', savedProducts);

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

    const updatedSavedProducts = {
      ...savedProducts,
      [activeSearchId]: [...productsArray],
    };
    console.log('[saveProduct] Updated savedProducts:', updatedSavedProducts);

    set({
      savedProducts: updatedSavedProducts,
    });
  },

  saveMorePresentations: (morePresentations: string[]) =>
    set({ morePresentations }),

  removeProduct: (productId: string) => {
    const { activeSearchItem, savedProducts } = get();
    console.log('[removeProduct] called with:', productId);
    // Use the active search ID or default to "generic"
    const activeSearchId = activeSearchItem?.id || 'default';
    const productsArray = savedProducts[activeSearchId] || [];
    console.log('[removeProduct] Current productsArray:', productsArray);
    // Filter out the product with the matching id and providerId
    const updatedProductsArray = productsArray.filter(
      (p) => !(p.id === productId)
    );
    console.log('[removeProduct] Updated productsArray:', updatedProductsArray);
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
    if (!savedProducts) {
      console.warn('[getAllSavedProducts] savedProducts is undefined');
      return [];
    }
    const allProducts = Object.values(savedProducts).flat();
    console.log('[getAllSavedProducts] allProducts:', allProducts);
    return allProducts;
  },

  reset: () => {
    console.log(
      '[reset] called. Resetting savedProducts and activeSearchItem.'
    );
    set({ savedProducts: {}, activeSearchItem: null });
  },
}));

export default UseSearchStore;
