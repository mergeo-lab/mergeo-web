import { cn } from "@/lib/utils"

type Props = {
    id: string,
    name: string,
    active: boolean,
    onClick: (id: string) => void
}

export default function SearchListButton({ id, name, active, onClick }: Props) {
    return (
        <div className={cn("w-full cursor-pointer", {
            "[&>*]:hover:scale-105 [&>*]:hover:my-1 [&>*]:hover:shadow": !active
        })}>
            <div className={cn("w-full cursor-pointer flex items-center px-6 py-2 border border-border rounded transition-all duration-200", {
                "border-primary border bg-white text-primary cursor-default": active
            })} onClick={() => active ? null : onClick(id)}>
                <span className="text-ellipsis text-nowrap w-fit overflow-hidden">
                    {name}
                </span>
            </div>
        </div>
    )
}