import { DiscountSchemaType } from "@/lib/schemas/discounts.schema";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    data: DiscountSchemaType;
    selectedItem?: boolean;
    onClick?: (id: string) => void;
    children?: React.ReactNode;
}

export default function DiscountListItem({ className, data, selectedItem, onClick, children }: Props) {
    return (
        <div className={cn("w-full max-w-[23.13rem] py-2 px-10 border-border border-b-2 cursor-pointer hover:bg-border/90 transition-all relative", className, {
            "text-white bg-gradient-to-r from-primary/40 via-primary to-primary pl-16 font-bold cursor-default": selectedItem
        })}
            onClick={() => onClick && onClick(data.id!)}
        >
            <div className={cn("truncate max-w-52", {
                'max-w-48': selectedItem,
            })} title={data.name}>
                {data.name}
            </div>

            <div className="absolute right-4 top-0 h-[2.625rem] flex justify-center items-center">
                {children}
            </div>
        </div>
    );
}