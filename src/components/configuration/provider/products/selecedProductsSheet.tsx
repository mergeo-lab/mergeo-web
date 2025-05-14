import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { cn } from "@/lib/utils";
import { AddProduct } from "@/store/addProductItem.store";
import { Button } from "@/components/ui/button";
import { AddProductItem } from "@/components/configuration/provider/products/addProductItem";
import sinSeleccion from '@/assets/empty-shelvs.png';
import { saveMultipleProducts } from "@/lib/products";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: React.ReactNode,
    companyId: string | undefined,
    products: AddProduct[],
    triggerButton?: React.ReactNode,
    removeProduct?: (gtin: string) => void,
    onSaveCallback?: () => void
}

export function SelectedProductsSheet({
    title = "Agergar productos ",
    subTitle = "Subir los productos seleccionados",
    icon = <CloudUpload size={30} />,
    companyId,
    products,
    triggerButton,
    removeProduct,
    onSaveCallback
}: Props) {
    const mutation = useMutation({
        mutationFn: ({ products, companyId }: { products: AddProduct[], companyId: string }) => saveMultipleProducts(products, companyId)
    })
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(mutation.isPending);

    const closeModal = useCallback(() => {
        setOpen(false);
    }, []);

    const saveProducts = async () => {
        setIsLoading(true);
        const response = await mutation.mutateAsync({ products, companyId: companyId! });
        if (response.length > 0) {
            setIsLoading(false);
            onSaveCallback && onSaveCallback();
            closeModal()
        }

    }

    return (
        <Sheet open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                closeModal();
            } else {
                setOpen(isOpen);
            }
        }}>
            <SheetTrigger>
                {triggerButton}
            </SheetTrigger>
            <SheetContent className="w-1/3 mx-w-1/3 sm:max-w-1/3">
                <SheetHeader>
                    <SheetTitle className="flex gap-2 items-center">
                        {icon}
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                        {subTitle}
                    </SheetDescription>
                </SheetHeader>

                {!products.length &&
                    <div className="w-full h-[calc(100%-200px)] flex flex-col justify-center items-center">
                        <img src={sinSeleccion} alt="No sleccionaste productos" />
                        <p className="mt-5 font-bold">No seleccioanste ningun producto!</p>
                    </div>
                }

                <div className="w-full  h-[calc(100%-14rem)] overflow-y-auto space-y-2 mt-10">

                    {isLoading && <OverlayLoadingIndicator />}
                    {
                        products && products.map(product => (
                            <div key={product.gtin} className="relative rounded-sm w-full h-[130px] overflow-hidden bg-blue-50 group">
                                <div className={cn("absolute left-1 top-1 w-[98%] transition-all ease-in-out group-hover:-left-20 ")}>
                                    <AddProductItem
                                        gtin={product.gtin}
                                        name={product.name}
                                        brand={product.brand}
                                        netContent={product.netContent}
                                        measurmentUnit={product.measurementUnit}
                                        actualPrice={product.price}
                                        finalPrice={product.price}
                                        inInventory={product.isInInventory}
                                        className={"border w-full"}
                                        image={product.image}
                                    />
                                </div>
                                <div className="w-full h-full flex justify-end items-center pr-5">
                                    <Button
                                        variant="ghost"
                                        className="hover:bg-white [&>*]:hover:text-destructive h-14"
                                        onClick={() => removeProduct && removeProduct(product.gtin)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <SheetFooter className="absolute left-0 bottom-0 p-10 w-full flex justify-center border-t-2 bg-white">
                    <Button disabled={!products.length} className="w-full" onClick={() => {
                        products.length && saveProducts()
                    }}>
                        Subir productos
                    </Button>
                </SheetFooter>

            </SheetContent>
        </Sheet >
    )
}
