import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import OverlayLoadingIndicator from "@/components/ui/overlayLoadingIndicator";
import { cn } from "@/lib/utils";
import { AddProduct } from "@/store/addProductItem.store";
import { Button } from "@/components/ui/button";
import { AddProductItem } from "@/components/configuration/provider/products/addProductItem";
import sinSeleccion from '@/assets/empty-shelvs.png';
import { saveMultipleProducts } from "@/lib/products";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <div key={product.gtin} className="relative rounded-md border-4 border-blue-50 w-full h-[112px] overflow-hidden bg-blue-50 group">
                                <div className={cn("absolute left-1 top-0 w-[98%] transition-all ease-in-out group-hover:-left-20 ")}>
                                    <AddProductItem
                                        gtin={product.gtin}
                                        name={product.name}
                                        brand={product.brand}
                                        netContent={product.net_content}
                                        measurmentUnit={product.measurementUnit}
                                        price={product.price}
                                        finalPrice={product.price}
                                        inInventory={product.inInventory}
                                        className={"border w-full"}
                                    />
                                </div>
                                <div className="w-full h-full flex justify-end items-center">
                                    <div className="w-20 h-20 flex justify-center items-center cursor-pointer"
                                        onClick={() => removeProduct && removeProduct(product.gtin)}>
                                        <Trash2 />
                                    </div>
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
