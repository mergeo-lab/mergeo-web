import { create } from 'zustand';
import { SellProductSchemaType } from '@/lib/schemas/sell.schema';

type SellProviderState = {
  acceptedProducts: SellProductSchemaType[];
  rejectedProducts: SellProductSchemaType[];
  addAcceptedProduct: (product: SellProductSchemaType) => void;
  addAllAcceptedProducts: (products: SellProductSchemaType[]) => void;
  removeAcceptedProduct: (id: string) => void;
  removeAllAcceptedProducts: () => void;
  toggleProductAcceptance: (product: SellProductSchemaType) => void;
  toggleAllProducts: (allProducts: SellProductSchemaType[] | undefined) => void; // Accept all products for reference
};

const UseProviderSellStore = create<SellProviderState>((set, get) => ({
  acceptedProducts: [],
  rejectedProducts: [],

  addAcceptedProduct: (product: SellProductSchemaType) => {
    const { acceptedProducts, rejectedProducts } = get();

    // Add to accepted and remove from rejected
    set({
      acceptedProducts: [...acceptedProducts, product],
      rejectedProducts: rejectedProducts.filter((p) => p.id !== product.id),
    });
  },

  addAllAcceptedProducts: (products: SellProductSchemaType[]) => {
    // Add all products to accepted and clear rejected
    set({
      acceptedProducts: products,
      rejectedProducts: [],
    });
  },

  removeAcceptedProduct: (id: string) => {
    const { acceptedProducts, rejectedProducts } = get();

    // Move product from accepted to rejected
    const product = acceptedProducts.find((p) => p.id === id);
    if (product) {
      set({
        acceptedProducts: acceptedProducts.filter((p) => p.id !== id),
        rejectedProducts: [...rejectedProducts, product],
      });
    }
  },

  removeAllAcceptedProducts: () => {
    const { acceptedProducts } = get();

    // Move all accepted products to rejected
    set({
      acceptedProducts: [],
      rejectedProducts: [...get().rejectedProducts, ...acceptedProducts],
    });
  },

  toggleProductAcceptance: (product: SellProductSchemaType) => {
    const { acceptedProducts, rejectedProducts } = get();

    const isAccepted = acceptedProducts.some((p) => p.id === product.id);

    if (isAccepted) {
      // Move to rejected
      set({
        acceptedProducts: acceptedProducts.filter((p) => p.id !== product.id),
        rejectedProducts: [...rejectedProducts, product],
      });
    } else {
      // Move to accepted
      set({
        acceptedProducts: [...acceptedProducts, product],
        rejectedProducts: rejectedProducts.filter((p) => p.id !== product.id),
      });
    }
  },
  toggleAllProducts: (allProducts: SellProductSchemaType[] | undefined) => {
    const { acceptedProducts } = get();

    if (allProducts && acceptedProducts.length === allProducts.length) {
      // If all products are selected, unselect all
      set({
        acceptedProducts: [],
        rejectedProducts: allProducts,
      });
    } else {
      // If at least one product is unselected, select all
      set({
        acceptedProducts: allProducts,
        rejectedProducts: [],
      });
    }
  },
}));

export default UseProviderSellStore;
