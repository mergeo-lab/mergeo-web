import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload } from "lucide-react";
import { useCallback, useState } from "react";
import OverlayLoadingIndicator from "@/components/ui/overlayLoadingIndicator";
import { cn } from "@/lib/utils";
import { AddProduct } from "@/store/addProductItem.store";
import { Button } from "@/components/ui/button";
import { AddProductItem } from "@/components/configuration/provider/products/addProductItem";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string | undefined,
    products: AddProduct[],
    triggerButton?: React.ReactNode,
}

export function SelectedProductsSheet({
    title = "Agergar productos ",
    subTitle = "Subir los productos seleccionados",
    icon = <CloudUpload size={30} />,
    companyId,
    products,
    triggerButton,
}: Props) {
    // const mutation = useMutation({ mutationFn: newDropZone })
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const [isAdding, setIsAdding] = useState(false);

    const closeModal = useCallback(() => {
        setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    <div className="w-full h-full flex justify-center items-center">No seleccioanste ningun producto!</div>
                }

                <div className="h-full overflow-y-auto space-y-2 mt-10">
                    {products && products.map(product => (
                        <AddProductItem
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            brand={product.brand}
                            netContent={product.net_content}
                            measurmentUnit={product.measurementUnit}
                            price={product.price}
                            finalPrice={product.price}
                            inInventory={product.inInventory}
                            className={"border"}
                        />
                    ))}
                </div>

                <SheetFooter className="absolute left-0 bottom-0 p-10 w-full flex justify-center border-t-2">
                    <Button disabled={!products} className="w-full">
                        Subir productos
                    </Button>
                </SheetFooter>

            </SheetContent>
        </Sheet>
    )
}
