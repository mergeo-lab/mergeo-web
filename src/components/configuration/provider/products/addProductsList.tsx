import type { AddProduct } from "@/store/addProductItem.store";
import { AddProductItem } from "@/components/configuration/provider/products/addProductItem";
import DinamicGrid from "@/components/dinamicGrid";

type Props = {
    data: AddProduct[];
    addProduct: (product: AddProduct) => void;
};

export default function AddProductsList({ data, addProduct }: Props) {

    function handleSaveProduct(product: AddProduct, price: string) {
        const newProduct = product;
        newProduct.price = price;
        addProduct(newProduct);
    }

    return (
        <DinamicGrid>
            {data.map((item) => (
                <AddProductItem
                    key={item.gtin}
                    gtin={item.gtin}
                    name={item.name}
                    brand={item.brand}
                    netContent={item.netContent}
                    measurmentUnit={item.measurementUnit}
                    inInventory={item.isInInventory}
                    image={item.image}
                    actualPrice={item.price}
                    onSave={(gtin, price) => gtin === item.gtin && handleSaveProduct(item, price)}
                />
            ))
            }
        </DinamicGrid >
    );
}
