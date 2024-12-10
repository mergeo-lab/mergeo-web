import { useState, useEffect } from 'react';
import { AddProduct, useProductStore } from "@/store/addProductItem.store";
import { AddProductItem } from '@/components/configuration/provider/products/addProductItem';
import DinamicGrid from '@/components/dinamicGrid';

type Props = {
    data: AddProduct[]
}

export default function AddProductsList({ data }: Props) {
    const [products, setProducts] = useState<AddProduct[]>(data); // Initialize products with data from props
    const { addProduct, updateProduct, removeProduct } = useProductStore();

    useEffect(() => {
        // You can also sync with your store if you need to keep this data in sync
        setProducts(data);
    }, [data]);

    const handleUpdateProduct = (id: string, price: number) => {
        updateProduct(id, price); // Update the price of the product in the store
    };

    const handleRemoveProduct = (id: string) => {
        removeProduct(id); // Remove the product from the store
        setProducts((prev) => prev.filter(product => product.id !== id)); // Remove from local state
    };

    return (
        <DinamicGrid>
            {products && products.length && (
                products.map(item => (
                    <AddProductItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        brand={item.brand}
                        netContent={item.netContent}
                        measurmentUnit={item.measurmentUnit}
                        price={item.price}
                        onSave={handleUpdateProduct} // Pass save function
                        onRemove={handleRemoveProduct} // Pass remove function
                    />
                ))
            )}
        </DinamicGrid>
    );
}
