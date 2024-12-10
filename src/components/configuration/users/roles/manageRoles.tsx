import { NewRoleForm } from "@/components/configuration/users/roles/newRoleForm";
import { RoleDetail } from "@/components/configuration/users/roles/roleDetail";
import { RolePicker } from "@/components/configuration/users/roles/rolePicker";
import { DeleteConfirmationDialog } from "@/components/deleteConfirmationDialog";
import LoadingIndicator from "@/components/loadingIndicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { roleDelete, roleUpdate } from "@/lib/configuration/roles";
import { PermissionSchemaType, RoleSchemaType } from "@/lib/schemas";
import { getAllRoles, getPermissions } from "@/lib/configuration/users";
import { cn } from "@/lib/utils";
import UseCompanyStore from "@/store/company.store";
import UseRoleStore from "@/store/roles.store";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowBigRight, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const emptyRole: RoleSchemaType = {
    name: 'Crear nuevo rol',
    companyId: 'company',
    id: "empty",
    permissions: [],
    created: new Date(),
    updated: new Date(),
}

export function ManageRoles() {
    const roleStore = UseRoleStore();
    const { company } = UseCompanyStore();
    const [initialRoles, setInitialRoles] = useState<RoleSchemaType[]>([]);
    const [viewRole, setViewRole] = useState<RoleSchemaType>(emptyRole);
    const [roleEdited, setRoleEdited] = useState<RoleSchemaType>(emptyRole);
    const [isEditting, setIsEditting] = useState<boolean>(false);
    const previousRolesResponse = useRef<RoleSchemaType[] | null>(null);
    const mutation = useMutation({ mutationFn: roleUpdate })

    const { data: permissions, isLoading: isLoadingPermissions, isError: isErrorPermissions } = useQuery({
        queryKey: ['allPermissions'],
        queryFn: getPermissions,
    })

    const { data: rolesResponse, isLoading, isError, refetch } = useQuery({
        queryKey: ['roles', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getAllRoles(companyId);
        },
        enabled: !!company?.id, // Ensure the query runs only if company ID exists
    });

    useEffect(() => {
        if (!isLoading && !isError && rolesResponse && rolesResponse?.data) {
            if (previousRolesResponse.current !== rolesResponse.data.roles) {
                roleStore.setAllCompanyRoles(rolesResponse.data.roles);
                previousRolesResponse.current = rolesResponse.data.roles;
            }
        }
    }, [isLoading, isError, rolesResponse, roleStore]);

    const initializeRoles = useCallback(() => {

        const initialPermissions = permissions?.data && permissions?.data.map((permission: PermissionSchemaType) => ({
            ...permission,
            hasPermission: false,
        }));

        if (initialPermissions && initialPermissions.length > 0) {
            const initialEmptyRole = {
                ...emptyRole,
                permissions: initialPermissions,
            };
            if (!roleStore.allRoles.length) {
                setViewRole(initialEmptyRole);
            } else {
                setViewRole(roleStore.allRoles[0]);
            }
            setInitialRoles([initialEmptyRole, ...roleStore.allRoles]);
        }

    }, [permissions, roleStore.allRoles]);

    async function saveRoleChanges(role: RoleSchemaType) {
        const activePermissions = role.permissions.filter((p: PermissionSchemaType) => p.hasPermission);
        const response = await mutation.mutateAsync({ roleId: role.id, permissions: activePermissions });
        if (response.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            setIsEditting(false);
            refetch();
        }
    }

    function saveSelectedRoles(role: RoleSchemaType) {
        roleStore.addRole(role);
    }

    function roleEdictChange(role: RoleSchemaType) {
        setRoleEdited(role);
        roleIsEdited(role)
    }

    function roleIsEdited(role: RoleSchemaType) {
        if (permissionsChanged(role.permissions, viewRole.permissions) && role.permissions.find((p: PermissionSchemaType) => p.hasPermission)) {
            setIsEditting(true);
        } else {
            setIsEditting(false);
        }
    }

    function roleListChanged() {
        refetch();
        setIsEditting(false);
    }

    function changeRole(role: RoleSchemaType) {
        setIsEditting(false);
        setViewRole(role);
    }

    function permissionsChanged(originalPermissions: PermissionSchemaType[], editedPermissions: PermissionSchemaType[]): boolean {
        return originalPermissions.some((perm, index) => perm.hasPermission !== editedPermissions[index].hasPermission);
    }

    useEffect(() => {
        if (!isLoadingPermissions && !isErrorPermissions && permissions) {
            initializeRoles();
        }
    }, [initializeRoles, isLoadingPermissions, isErrorPermissions, permissions]);


    return (
        <>
            <RolePicker />
            <Dialog>
                <DialogTrigger className="w-full flex mt-2" asChild>
                    <Button variant='outline' className="w-full">Manejar roles</Button>
                </DialogTrigger>
                <DialogContent className="w-full">
                    {isLoading || isLoadingPermissions || mutation.isPending &&
                        <div className="w-full h-full absolute bg-white/60 z-10 flex justify-center items-center">
                            <LoadingIndicator />
                        </div>
                    }
                    <DialogHeader className="px-6 py-3 border bottom-1">
                        <DialogTitle>Roles de usuario</DialogTitle>
                        <DialogDescription>
                            Aquí puedes gestionar los roles de usuario
                        </DialogDescription>
                    </DialogHeader>
                    <div className="px-6 py-2">
                        <div className="flex justify-between gap-5">
                            <div className="w-full">
                                <div className="w-full">
                                    <Table className="min-w-full table-fixed">
                                        <TableHeader>
                                            <TableRow className="hover:bg-white">
                                                <TableHead className="m-0 w-2/6">Roles</TableHead>
                                                <TableHead className="m-0"></TableHead>
                                                <TableHead className="m-0 w-0"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        {
                                            initialRoles && initialRoles.length > 1 && (
                                                <TableRow className="max-h-[500px] w-[420px] block overflow-auto hover:bg-white">
                                                    <TableBody>
                                                        {
                                                            initialRoles.map((role) => (
                                                                role.id !== emptyRole.id
                                                                    ? (
                                                                        <TableRow key={role.id} className="hover:bg-white w-full">
                                                                            <TableCell className="m-0">
                                                                                <Badge
                                                                                    variant='outline'
                                                                                    key={role.id}
                                                                                >
                                                                                    <span>
                                                                                        {role.name}
                                                                                    </span>
                                                                                </Badge>
                                                                            </TableCell>

                                                                            <TableCell className="m-0 p-0 w-full">
                                                                                <div className="flex justify-evenly">
                                                                                    <Button variant="link" className="text-xs p-2 h-6" onClick={() => saveSelectedRoles(role)}>
                                                                                        Usar
                                                                                    </Button>
                                                                                    <Button variant="link" className="text-xs p-2 h-6" onClick={() => changeRole(role)}>
                                                                                        Ver
                                                                                    </Button>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <ArrowBigRight className={cn('text-primary opacity-0', {
                                                                                    'opacity-100': viewRole?.id == role.id
                                                                                })} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                    )
                                                                    : <TableRow key={role.id} className="absolute top-28 left-72 right-4 flex gap-4 border-none hover:bg-white">
                                                                        <div>
                                                                            <Button
                                                                                variant="outline"
                                                                                className=""
                                                                                size="xs"
                                                                                onClick={() => setViewRole(role)}>
                                                                                {role.name}
                                                                            </Button>
                                                                        </div>
                                                                        <ArrowBigRight className={cn('text-primary opacity-0', {
                                                                            'opacity-100': viewRole?.id == role.id
                                                                        })} />
                                                                    </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                </TableRow>
                                            )
                                        }
                                    </Table>
                                    {initialRoles && initialRoles.length <= 1
                                        ? (
                                            <div className="p-5 w-full flex items-center gap-2">
                                                <Alert>
                                                    <AlertTitle>No hay roles asociados a esta compnia</AlertTitle>
                                                    <AlertDescription>
                                                        Puedes crear un <span className="font-bold text-primary">Nuevo Rol</span> usando la plantilla de la derecha
                                                    </AlertDescription>
                                                </Alert>
                                                <ArrowBigRight className="text-primary" />
                                            </div>
                                        )
                                        : (
                                            <div className="text-sm text-secondary-background w-full text-center pt-3">
                                                Puedes ver el detalle del Rol haciendo click en
                                                <span className="font-bold"> ver</span>
                                                <br />
                                                o seleccionarlo haciendo click en
                                                <span className="font-bold"> usar</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="p-4 border border-border rounded shadow">
                                {viewRole && viewRole.permissions &&
                                    <RoleDetail key={viewRole.id} isEdited={(role) => roleEdictChange(role)} role={viewRole} canEdit />
                                }
                                <div className="flex items-center justify-end rounded border border-border p-2 gap-2">

                                    <NewRoleForm
                                        role={roleEdited}
                                        roleAdded={roleListChanged}
                                        isEditting={isEditting}
                                        emptyRoleId={emptyRole.id}
                                        viewRoleId={viewRole.id}
                                    />
                                    {viewRole.id !== emptyRole.id &&
                                        <div className="flex gap-2 items-baseline">
                                            <Button
                                                size="sm"
                                                disabled={!isEditting}
                                                variant="highlight"
                                                className="text-xs h-6"
                                                onClick={() => saveRoleChanges(roleEdited)}
                                            >
                                                Guardar cambios
                                            </Button>
                                            <DeleteConfirmationDialog
                                                id={viewRole.id}
                                                name={viewRole.name}
                                                title="Borrar Rol"
                                                question="¿Estas seguro que quieres borrar el rol"
                                                triggerButton={<Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="text-xs h-6"
                                                >
                                                    Borrar
                                                </Button>}
                                                mutationFn={roleDelete}
                                                callback={roleListChanged} onLoading={function (): void {
                                                    throw new Error("Function not implemented.");
                                                }} />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div>
                            Roles Seleccionados
                            <ScrollArea className="flex flex-wrap h-auto min-h-[50px] max-h-[150px] w-full rounded border border-input bg-background p-2">
                                {
                                    roleStore.roles && roleStore.roles.length > 0 && roleStore.roles.map((role) => (
                                        <Badge
                                            variant="outline"
                                            className="m-1"
                                            key={role.id}
                                        >
                                            <span className="flex gap-2 items-center text-sm">
                                                {role.name}
                                                <XCircle
                                                    size={18}
                                                    className="z-10 cursor-pointer"
                                                    onClick={() => roleStore.removeRole(role.id)}
                                                />
                                            </span>
                                        </Badge>
                                    ))
                                }
                            </ScrollArea >
                        </div>
                    </div>
                    <DialogFooter className="w-full border top-1 px-6 py-3">
                        <DialogClose className="w-40">
                            <Button variant="secondary" className="w-full" onClick={() => roleStore.removeAllRoles()
                            }>Cancelar</Button>
                        </DialogClose>
                        <DialogClose className="w-40" disabled={roleStore.roles.length == 0}>
                            <Button className="w-40" disabled={roleStore.roles.length == 0}>Aplicar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    )
}