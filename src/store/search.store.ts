import { ProductSchemaType, SearchListProductType } from '@/lib/schemas';
import { ReplacementCriteria } from '@/lib/constants';
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
  deliveryDate?: Date;
};

export type ProductWithQuantity = CartProduct & {
  quantity: number;
  deliveryDate?: Date;
  replacementCriteria?: ReplacementCriteria;
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
  updateProductDeliveryDate: (
    productId: string,
    deliveryDate: Date | null
  ) => void;
  updateProductReplacementCriteria: (
    productId: string,
    replacementCriteria: ReplacementCriteria | null
  ) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
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
    const { savedProducts } = get();

    // Remove product from all search lists
    const updatedSavedProducts: SavedProducts = {};
    Object.keys(savedProducts).forEach((searchId) => {
      const productsArray = savedProducts[searchId] || [];
      const updatedProductsArray = productsArray.filter(
        (p) => p.id !== productId
      );
      updatedSavedProducts[searchId] = updatedProductsArray;
    });

    set({
      savedProducts: updatedSavedProducts,
    });
  },

  updateProductDeliveryDate: (productId: string, deliveryDate: Date | null) => {
    const { activeSearchItem, savedProducts } = get();
    console.log('[updateProductDeliveryDate] called with:', {
      productId,
      deliveryDate,
    });
    const activeSearchId = activeSearchItem?.id || 'default';
    const productsArray = savedProducts[activeSearchId] || [];
    console.log(
      '[updateProductDeliveryDate] Current productsArray:',
      productsArray
    );

    const updatedProductsArray = productsArray.map((product) =>
      product.id === productId
        ? { ...product, deliveryDate: deliveryDate || undefined }
        : product
    );
    console.log(
      '[updateProductDeliveryDate] Updated productsArray:',
      updatedProductsArray
    );

    set({
      savedProducts: {
        ...savedProducts,
        [activeSearchId]: updatedProductsArray,
      },
    });
  },

  updateProductReplacementCriteria: (
    productId: string,
    replacementCriteria: ReplacementCriteria | null
  ) => {
    const { activeSearchItem, savedProducts } = get();
    console.log('[updateProductReplacementCriteria] called with:', {
      productId,
      replacementCriteria,
    });
    const activeSearchId = activeSearchItem?.id || 'default';
    const productsArray = savedProducts[activeSearchId] || [];
    console.log(
      '[updateProductReplacementCriteria] Current productsArray:',
      productsArray
    );

    const updatedProductsArray = productsArray.map((product) =>
      product.id === productId
        ? { ...product, replacementCriteria: replacementCriteria || undefined }
        : product
    );
    console.log(
      '[updateProductReplacementCriteria] Updated productsArray:',
      updatedProductsArray
    );

    set({
      savedProducts: {
        ...savedProducts,
        [activeSearchId]: updatedProductsArray,
      },
    });
  },

  updateProductQuantity: (productId: string, quantity: number) => {
    const { activeSearchItem, savedProducts } = get();
    console.log('[updateProductQuantity] called with:', {
      productId,
      quantity,
    });
    const activeSearchId = activeSearchItem?.id || 'default';
    const productsArray = savedProducts[activeSearchId] || [];
    console.log(
      '[updateProductQuantity] Current productsArray:',
      productsArray
    );

    const updatedProductsArray = productsArray.map((product) =>
      product.id === productId ? { ...product, quantity } : product
    );
    console.log(
      '[updateProductQuantity] Updated productsArray:',
      updatedProductsArray
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
    console.log('[getSavedProductById] looking for product:', id);
    console.log('[getSavedProductById] savedProducts:', savedProducts);
    const product = Object.values(savedProducts)
      .flat()
      .find((p) => p.id === id);
    console.log('[getSavedProductById] found product:', product);
    return product;
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
