import UseSearchStore, { ProductWithQuantity } from "@/store/search.store";
import { TableRow, TableCell } from "@/components/ui/table";
import { Image } from "lucide-react";
import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";

export default function ProductRow({ data, cellsWidth }: { data: ProductWithQuantity, cellsWidth: string }) {

    const { saveProduct, removeProduct, getAllSavedProducts } = UseSearchStore();

    function handleProductChange(product: ProductWithQuantity, quantity: number) {
        if (quantity === 0) {
            removeProduct(product.id, product.providerId);
        } else {
            saveProduct(product, quantity);
        }
    }
    return (
        <TableRow>
            <TableCell className="p-0 m-0 py-2 w-48">
                <div className="flex justify-start items-center w-full">

                    <div className="bg-border rounded p-4">
                        <Image size={50} className="text-white" />
                    </div>
                    {/* {data.image !== ""
                    ? <img src={data.image} alt="" />
                    : <Image size={50} className="text-muted" />
                    } */}
                    <div className="flex flex-col ml-2">
                        <div className="font-semibold">{data.name}</div>
                        <div className="text-muted font-thin text-sm">{data.brand}</div>
                    </div>
                </div>
            </TableCell>

            <TableCell className={`${cellsWidth} text-center`}>{data.net_content}</TableCell>
            <TableCell className={`${cellsWidth} text-center`}>{data.measurementUnit}</TableCell>
            <TableCell className={`${cellsWidth} text-center`}>{data.price}</TableCell>
            <TableCell className={`${cellsWidth} text-center`}>{
                data.net_content ? (+data.price * data.net_content) : 1}</TableCell>
            <TableCell className={`${cellsWidth} text-right`}>
                <div className="flex justify-end">
                    <QuantitySelector
                        defaultValue={getAllSavedProducts().find((item: ProductWithQuantity) => item.id === data.id)?.quantity}
                        onChange={(quantity: number) => handleProductChange(data, quantity)} />
                </div>
            </TableCell>
        </TableRow>
    )
}