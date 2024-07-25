import { GroupedPermissionsSchemaType, PermissionSchemaType } from "@/lib/configuration/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check } from "@/components/check";

type Props = {
    permissions: PermissionSchemaType[]
}

export function RoleDetail({ permissions }: Props) {

    function groupAndTransformPermissions(permissions: PermissionSchemaType[]): GroupedPermissionsSchemaType[] {
        const groupedPermissions: Record<string, GroupedPermissionsSchemaType> = {};

        permissions.forEach(permission => {
            const { group, action, hasPermission } = permission;

            if (!groupedPermissions[group]) {
                groupedPermissions[group] = {
                    group,
                    create: false,
                    edit: false,
                    delete: false,
                };
            }

            if (action === 'create') {
                groupedPermissions[group].create = hasPermission;
            } else if (action === 'edit') {
                groupedPermissions[group].edit = hasPermission;
            } else if (action === 'delete') {
                groupedPermissions[group].delete = hasPermission;
            }
        });

        return Object.values(groupedPermissions);
    }

    const groupedPermissions = groupAndTransformPermissions(permissions);

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-white">
                    <TableHead className="m-0 w-1/2">Permisos</TableHead>
                    <TableHead className="w-fit p-0 m-0">Crear</TableHead>
                    <TableHead className="w-fit p-0 m-0">Editar</TableHead>
                    <TableHead className="w-fit p-0 m-0">Borrar</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {groupedPermissions.map((permisionGroup) => (
                    <TableRow key={permisionGroup.group} className="hover:bg-white [&>td]:!py-2">
                        <TableCell className="text-left m-0">{permisionGroup.group}</TableCell>
                        <TableCell className="text-center">
                            <Check positive={permisionGroup.create} />
                        </TableCell>
                        <TableCell className="text-center">
                            <Check positive={permisionGroup.edit} />
                        </TableCell>
                        <TableCell className="text-center">
                            <Check positive={permisionGroup.delete} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}