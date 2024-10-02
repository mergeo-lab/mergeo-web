import { cn } from "@/lib/utils"

type Props = {
    id: string,
    name: string,
    active: boolean,
    onClick: (id: string) => void
}

export default function SearchListButton({ id, name, active, onClick }: Props) {
    return (
        <div className={cn("w-full cursor-pointer flex items-center px-6 py-3 bg-border rounded transition-all duration-200", {
            "border-primary border bg-white text-primary font-bold shadow-md cursor-default": active,
        })} onClick={() => active ? null : onClick(id)}>
            <span className="text-ellipsis text-nowrap w-fit overflow-hidden">
                {name}
            </span>
        </div>
    )
}