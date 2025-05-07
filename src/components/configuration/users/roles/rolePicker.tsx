import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RoleSchemaType } from "@/lib/schemas"
import UseRoleStore from "@/store/roles.store"
import { CircleX } from "lucide-react"

type Props = {
    className?: string,
}

export function RolePicker({ className }: Props) {
    const roleStore = UseRoleStore();

    return (
        <div className={className}>
            <ScrollArea className="h-auto max-h-[150px] min-h-10 w-full rounded border border-input bg-background p-2">
                <div className="flex flex-wrap gap-1 items-center">
                    {
                        roleStore.roles && roleStore.roles.length > 0 ?
                            roleStore.roles.map((role: RoleSchemaType) => (
                                <Badge
                                    key={role.id}
                                    variant="outline"
                                >
                                    <span className="flex gap-2 items-center text-sm">
                                        {role.name}
                                        {role.name !== "Admin" &&
                                            <CircleX
                                                size={18}
                                                className="z-10 cursor-pointer"
                                                onClick={() => roleStore.removeRole(role.id)}
                                            />
                                        }
                                    </span>
                                </Badge>
                            ))
                            : <p className="text-sm font-bold mt-1 w-full text-center">No hay roles seleccionados</p>
                    }
                </div>
            </ScrollArea >
        </div>
    )
}