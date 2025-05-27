
import { FaBoxesPacking } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscountProducts from "@/components/configuration/provider/discounts/discountProducts";
import DiscountAddProducts from "@/components/configuration/provider/discounts/discountAddProducts";
import { useEffect, useState } from "react";

type Props = {
    className?: string,
    companyId: string,
    selectedDiscountId?: string | null,
    discount?: number,
}

export default function DiscountTabs({ className, companyId, selectedDiscountId, discount = 0 }: Props) {
    const [tab, setTab] = useState("products");

    useEffect(() => {
        setTab("products");
    }, [selectedDiscountId])

    if (!selectedDiscountId) {
        return (
            <div className='w-full h-full flex flex-col justify-center items-center relative'>
                <FaBoxesPacking size={300} className='text-muted/10' />
                <p className='text-md'>
                    Selecciona una lista para ver los productos
                </p>
            </div>
        )
    }

    return (
        <div className={cn("w-full h-full", className)}>
            <Tabs value={tab} onValueChange={setTab} className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/20">
                    <TabsTrigger value="products">Productos</TabsTrigger>
                    <TabsTrigger value="add">Agregar Productos</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="h-full">
                    <DiscountProducts selectedDiscountId={selectedDiscountId} discount={discount} />
                </TabsContent>
                <TabsContent value="add" className="h-full">
                    <DiscountAddProducts
                        companyId={companyId}
                        discountListId={selectedDiscountId}
                        discount={discount}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
