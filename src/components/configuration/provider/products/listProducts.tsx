import { AddProductItem } from "@/components/configuration/provider/products/addProductItem";
import DynamicGrid from "@/components/dinamicGrid";
import { useProductStore } from "@/store/addProductItem.store";


export default function ListProducts() {
    const { removeProduct } = useProductStore();
    const allProducts = useProductStore((state) => state.getAllProducts());

    const handleRemoveProduct = (id: string) => {
        // Remove the product from the store
        removeProduct(id);
    };

    return (
        <div className="m-5">
            <DynamicGrid>
                {allProducts.map((item) => (
                    <AddProductItem
                        className="shadow"
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        brand={item.brand}
                        netContent={item.net_content}
                        measurmentUnit={item.measurementUnit}
                        price={item.price}
                        onRemove={() => handleRemoveProduct(item.id)}
                    />
                ))}
            </DynamicGrid>
        </div>
    )
}