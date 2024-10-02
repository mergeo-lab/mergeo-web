import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { SearchListProductType } from "@/lib/searchLists/searchLists.schemas";
import { Trash2 } from "lucide-react";

type Props = {
    products: SearchListProductType[] | null,
    removeProduct: (id: string) => void,
    maxHeight?: string
}

export default function SearchProductsTable({ products, removeProduct, maxHeight = "200px" }: Props) {
    console.log(products)
    if (!products || products.length === 0) return <></>
    return (
        <div className="px-4 mt-4 border rounded">
            <div className="overflow-hidden">
                <Table className="min-w-full table-fixed">
                    <TableHeader>
                        <TableRow className="hover:bg-white">
                            <TableHead className="m-0 w-2/5">Nombre</TableHead>
                            <TableHead className="m-0 w-2/5">Categoria</TableHead>
                            <TableHead className="m-0"></TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
            {
                <div className={`overflow-y-auto max-h-[${maxHeight}]`}>
                    <Table className="min-w-full table-fixed">
                        <TableBody>
                            {
                                products.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-white w-full py-0">
                                        <TableCell className=" w-2/5 m-0 p-0 py-2 px-4 leading-none">
                                            {product.name}
                                        </TableCell>
                                        <TableCell className=" w-2/5 m-0 p-0 py-2 px-4 leading-none">
                                            {product.category}
                                        </TableCell>
                                        <TableCell className="m-0 p-0 py-2 px-4 leading-none">
                                            <div className="w-full flex justify-end">
                                                <Button variant="ghost" className="w-fit h-fit" onClick={() => removeProduct(product.id!)}>
                                                    <Trash2 size={15} className="text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            }
        </div >
    )
}