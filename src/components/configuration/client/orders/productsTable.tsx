import { Skeleton } from "@/components/ui/skeleton";
import { useProductSearch } from "@/hooks/useProductsSearch";
import { CartProduct } from "@/store/search.store";
import { Table, TableHeader, TableHead, TableBody, TableRow } from "@/components/ui/table";
import ProductRow from "@/components/configuration/client/orders/productRow";
import { Button } from "@/components/ui/button";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import cancelConfig from "@/assets/config-cancel.png";
import productNotFound from "@/assets/product-not-found.png";

type Params = {
    configCompleted: boolean,
    configCanceled: boolean
}

export default function ProductsTable({ configCompleted = false, configCanceled }: Params) {
    const { setConfigDialogOpen, searchParams, setConfigDataSubmitted } = UseSearchConfigStore();

    const { data, isLoading, error } = useProductSearch({
        name: searchParams.name,
        brand: searchParams.brand,
    }, configCompleted);

    const tableCellWidth = `w-[calc(100%/6)]`;

    if (!configCompleted && configCanceled) {
        return (
            <div className="w-full h-full flex flex-col gap-10 pt-10 items-center">
                <h1 className="text-2xl font-thin text-secondary text-wrap text-center">Para poder ver productos tienes que completar la configuración inicial</h1>
                <div className="w-fit h-[350px]">
                    <img className="h-[350px]" src={cancelConfig} alt="config incomplete" />
                </div>
                <Button className="w-1/3" variant="outline" onClick={() => {
                    setConfigDataSubmitted(false);
                    setConfigDialogOpen(true);
                }}>Configuración</Button>
            </div>
        )
    }

    if (data?.products.length === 0) {
        return (
            <div className={
                "w-full h-full flex flex-col gap-10 pt-10 items-center [&>p]:multi-[font-thin;text-secondary/80;text-center;leading-3;p-0;m-0]"}>
                <img className="h-[350px]" src={productNotFound} alt="config incomplete" />
                <h1 className="text-3xl font-thin text-secondary text-wrap text-center">No encontramos el producto!</h1>
                <p>Para encontrar el producto que estas buscando utiliza el buscador de la derecha.</p>
                <p>También puedes usar una de tus listas ya cargadas y hacer tus búsquedas super rápidas </p>
            </div>
        )
    }

    if (isLoading || !configCompleted) {
        return (
            <>
                <ProductsTableHeader tableCellWidth={tableCellWidth} />
                <div>
                    <div className="space-y-4 mt-5 mx-6 opacity-25">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-20 rounded-sm bg-muted/50" />
                        ))}
                    </div>
                </div>
            </>
        )
    }
    if (error) return <p>{error.message}</p>;

    return (
        <div className="relative">
            <div className="h-1 w-full bg-transparent shadow-md shadow-slate-950/30 absolute top-[43px]"></div>
            <ProductsTableHeader tableCellWidth={tableCellWidth} />
            <div className="h-[calc(100vh-280px)] overflow-y-auto px-2">
                <Table>
                    <TableBody className="[&>*]:hover:bg-white">
                        {data && data?.products.map((item: CartProduct) => (
                            <ProductRow key={item.id} data={item} cellsWidth={tableCellWidth} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function ProductsTableHeader({ tableCellWidth }: { tableCellWidth: string }) {
    return (
        <Table>
            <TableHeader className="bg-white">
                <TableRow className="hover:bg-white">
                    <TableHead className="w-64">Producto</TableHead>
                    <TableHead className={`${tableCellWidth} text-center`}>Unidad</TableHead>
                    <TableHead className={`${tableCellWidth} text-center`}>Unidad de Medida</TableHead>
                    <TableHead className={`${tableCellWidth} text-center`}>Precio por Unidad de Medida</TableHead>
                    <TableHead className={`${tableCellWidth} text-center`}>Precio</TableHead>
                    <TableHead className={`${tableCellWidth} text-right pr-12`}>Cantidad</TableHead>
                </TableRow>
            </TableHeader>
        </Table>
    )
}