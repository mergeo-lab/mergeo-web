import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check } from "@/components/check";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback, useEffect, useState } from "react";
import { GroupedPermissionsSchemaType, PermissionSchemaType, RoleSchemaType } from "@/lib/schemas";

type Props = {
    role: RoleSchemaType,
    canEdit?: boolean,
    isEdited?: (role: RoleSchemaType) => void
}

export function RoleDetail({ role, canEdit = false, isEdited }: Props) {

    const [permissionsList, setPermissionsList] = useState<GroupedPermissionsSchemaType[]>([]);

    const groupAndTransformPermissions = useCallback((permissions: PermissionSchemaType[]): GroupedPermissionsSchemaType[] => {
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
    }, []);


    useEffect(() => {
        setPermissionsList(groupAndTransformPermissions(role.permissions));
    }, [groupAndTransformPermissions, role.permissions]);


    const checkboxChange = useCallback((permissionGroup: GroupedPermissionsSchemaType, action: 'create' | 'edit' | 'delete' | 'todos') => {
        const updatedPermissionsList = permissionsList.map(permission => {
            if (permission.group === permissionGroup.group) {
                if (action === 'todos') {
                    const newValue = !(permissionGroup.create && permissionGroup.edit && permissionGroup.delete);
                    return {
                        ...permission,
                        create: newValue,
                        edit: newValue,
                        delete: newValue
                    };
                } else {
                    return { ...permission, [action]: !permissionGroup[action] };
                }
            }
            return permission;
        });

        setPermissionsList(updatedPermissionsList);

        if (role && isEdited) {
            const updatedRole: RoleSchemaType = {
                ...role,
                permissions: role.permissions.map(permission => {
                    const matchedGroup = updatedPermissionsList.find(group => group.group === permission.group);
                    if (matchedGroup) {
                        return {
                            ...permission,
                            hasPermission: matchedGroup[permission.action as 'create' | 'edit' | 'delete']
                        };
                    }
                    return permission;
                })
            };

            isEdited(updatedRole);
        }
    }, [permissionsList, role, isEdited]);

    return (
        <div className="h-[430px] min-w-[370px]">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-white">
                        <TableHead className="m-0 w-1/2">Permisos</TableHead>
                        <TableHead className="w-fit pr-1 m-0">Crear</TableHead>
                        <TableHead className="w-fit pr-1 m-0">Editar</TableHead>
                        <TableHead className="w-fit pr-1 m-0">Borrar</TableHead>
                        {canEdit &&
                            <TableHead className="w-fit pr-1 m-0">Todos</TableHead>
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissionsList.map((permisionGroup) => (
                        <TableRow key={permisionGroup.group} className="hover:bg-white [&>td]:!py-2">
                            <TableCell className="text-left m-0">{permisionGroup.group}</TableCell>
                            <TableCell className="text-center h-10">
                                {canEdit
                                    ? <Checkbox checked={permisionGroup.create} onClick={() => checkboxChange(permisionGroup, 'create')} />
                                    : <Check positive={permisionGroup.create} />
                                }
                            </TableCell>
                            <TableCell className="text-center">
                                {canEdit
                                    ? <Checkbox className="border-border" checked={permisionGroup.edit} onClick={() => checkboxChange(permisionGroup, 'edit')} />
                                    : <Check positive={permisionGroup.edit} />
                                }
                            </TableCell>
                            <TableCell className="text-center">
                                {canEdit
                                    ? <Checkbox checked={permisionGroup.delete} onClick={() => checkboxChange(permisionGroup, 'delete')} />
                                    : <Check positive={permisionGroup.delete} />
                                }
                            </TableCell>
                            {canEdit &&
                                < TableCell className="text-center">
                                    <Checkbox checked={permisionGroup.create && permisionGroup.edit && permisionGroup.delete} onClick={() => checkboxChange(permisionGroup, 'todos')} />
                                </TableCell>
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table >
        </div>

    )
}