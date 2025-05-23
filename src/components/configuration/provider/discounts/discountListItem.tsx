import NewDiscount from "@/components/configuration/provider/discounts/newDiscount";
import { Button } from "@/components/ui/button";
import { CreateDiscountSchemaType } from "@/lib/schemas/discounts.schema";
import { cn } from "@/lib/utils";
import { GoPencil } from "react-icons/go";

type Props = {
    className?: string;
    data: CreateDiscountSchemaType;
    selectedItem?: boolean;
    onClick?: (id: string) => void;
}

export default function DiscountListItem({ className, data, selectedItem, onClick }: Props) {
    return (
        <div className={cn("w-full max-w-[23.13rem] py-2 px-10 border-border border-b-2 cursor-pointer hover:bg-border/90 transition-all relative", className, {
            "text-white bg-gradient-to-r from-primary/40 via-primary to-primary pl-20 font-bold cursor-default": selectedItem
        })}
            onClick={() => onClick && onClick(data.id!)}
        >
            <div className="truncate max-w-72" title={data.name}>
                {data.name}
            </div>

            <div className="absolute right-4 top-0 h-[2.625rem] flex justify-center items-center">
                <NewDiscount
                    callback={() => { }}
                    data={data}
                    triggerButton={
                        <Button variant="ghost" className="h-8 w-8! flex justify-center items-center hover:bg-white">
                            <GoPencil size={16} />
                        </Button>
                    }
                />
            </div>
        </div>
    );
}