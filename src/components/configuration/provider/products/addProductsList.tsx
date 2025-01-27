import { AddProduct, useProductStore } from "@/store/addProductItem.store";
import { AddProductItem } from "@/components/configuration/provider/products/addProductItem";
import DinamicGrid from "@/components/dinamicGrid";

type Props = {
    data: AddProduct[];
};

export default function AddProductsList({ data }: Props) {
    const { addProduct, removeProduct } = useProductStore();

    function handleSaveProduct(product: AddProduct, price: string) {
        const newProduct = product;
        newProduct.id = crypto.randomUUID();
        newProduct.price = price;
        addProduct(newProduct);
    }

    function handleRemoveProduct(id: string) {
        console.log("removing product: ", id)
        removeProduct(id);
    }

    return (
        <DinamicGrid>
            {data.map((item) => (
                <AddProductItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    brand={item.brand}
                    netContent={item.net_content}
                    measurmentUnit={item.measurementUnit}
                    price={item.price}
                    inInventory={item.inInventory}
                    onSave={(id, price) => id === item.id && handleSaveProduct(item, price)}
                    onRemove={(id) => handleRemoveProduct(id)}
                    className={""}
                />
            ))}
        </DinamicGrid>
    );
}
