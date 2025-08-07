import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { LuClipboardList } from "react-icons/lu";
import { getSearchLists, newSearchList, addProductsToList } from "@/lib/searchLists/searchLists";
import { useQuery, useMutation } from "@tanstack/react-query";
import UseCompanyStore from "@/store/company.store";
import LoadingIndicator from "@/components/loadingIndicator";
import { toast } from "@/components/ui/use-toast";
import { ProductWithQuantity } from "@/store/search.store";
import { useAuth } from "@/context/AuthContext";

type Props = {
    isOpen: boolean;
    isAnimating: boolean;
    listName: string;
    setListName: (name: string) => void;
    selectedExistingList: string;
    setSelectedExistingList: (list: string) => void;
    listType: 'new' | 'existing';
    setListType: (type: 'new' | 'existing') => void;
    onCancel: () => void;
    products: ProductWithQuantity[];
};

export function SaveOrderList({
    isOpen,
    isAnimating,
    listName,
    setListName,
    selectedExistingList,
    setSelectedExistingList,
    listType,
    setListType,
    onCancel,
    products
}: Props) {
    const { company } = UseCompanyStore();
    const { account } = useAuth();
    const user = account?.user;

    // Mutation para crear nueva lista o agregar productos a lista existente
    const saveListMutation = useMutation({
        mutationFn: async ({
            listName,
            products,
            listType,
            selectedListId
        }: {
            listName: string;
            products: ProductWithQuantity[];
            listType: 'new' | 'existing';
            selectedListId?: string;
        }) => {
            if (!company?.id || !user) {
                throw new Error('Company ID or user is undefined');
            }

            const listProducts = products.map(product => ({
                name: product.name + ' ' + product.variety,
                category: product.segment,
            }));

            if (listType === 'new') {
                // Crear nueva lista
                return newSearchList({
                    companyId: company.id,
                    body: {
                        name: listName.trim(),
                        createdBy: user.name,
                        products: listProducts
                    }
                });
            } else {
                // Agregar productos a lista existente
                if (!selectedListId) {
                    throw new Error('List ID is required for existing list');
                }
                return addProductsToList({
                    listId: selectedListId,
                    body: listProducts
                });
            }
        },
        onSuccess: () => {
            toast({
                title: "Lista actualizada",
                description: "Los productos se han guardado en la lista correctamente.",
                duration: 2000, // 3 segundos en lugar de 1 minuto
            });
            // Cerrar el modal después de guardar exitosamente
            handleCloseModal();
        },
        onError: (error: unknown) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Error al guardar la lista. Inténtelo de nuevo.",
                duration: 3000, // 5 segundos para errores (un poco más largo para que el usuario pueda leer)
            });
        }
    });

    // Query para obtener las listas existentes
    const { data: existingLists, isLoading: isLoadingLists } = useQuery({
        queryKey: ['searchLists', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getSearchLists(companyId);
        },
        enabled: !!company?.id,
        refetchOnWindowFocus: false,
    });

    const handleCloseModal = () => {
        // Reset form
        setListName('');
        setSelectedExistingList('');
        setListType('new');
        // Close modal
        onCancel();
    };

    const handleSaveList = async () => {
        console.log('handleSaveList called with listName:', listName);

        if (listType === 'new' && !listName.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor ingrese un nombre para la lista",
            });
            return;
        }

        if (listType === 'existing' && !selectedExistingList) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor seleccione una lista existente",
            });
            return;
        }

        if (products.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No hay productos para guardar en la lista",
            });
            return;
        }

        try {
            const finalListName = listType === 'new' ? listName : selectedExistingList;
            console.log('Saving list with name:', finalListName);

            // Encontrar el ID de la lista seleccionada si es una lista existente
            let selectedListId: string | undefined;
            if (listType === 'existing' && existingLists) {
                const selectedList = existingLists.find(list => list.name === selectedExistingList);
                selectedListId = selectedList?.id;
            }

            await saveListMutation.mutateAsync({
                listName: finalListName,
                products: products,
                listType: listType,
                selectedListId: selectedListId
            });
        } catch (error: unknown) {
            console.error('Error in handleSaveList:', error);
            // Error handling is done in the mutation onError callback
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute -top-6 -left-6 -right-6 -bottom-8 flex items-center justify-center z-50 p-20">
            <Card className={`bg-white shadow-lg rounded-lg z-30 h-fit transition-all duration-300 ease-in-out transform ${isAnimating
                ? 'opacity-0 scale-95'
                : 'opacity-100 scale-100'
                }`}>
                <CardHeader>
                    <CardTitle className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2">
                            <LuClipboardList size={20} />
                            <h3 className="text-lg font-bold">Guardar productos del pedido en una lista</h3>
                        </div>
                        <p className=" text-[14px] font-light ">Podras usar esta lista para hacer pedidos en el buscador</p>
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative p-5">
                    {saveListMutation.isPending && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                            <div className="flex flex-col items-center gap-2">
                                <LoadingIndicator size={8} />
                                <span className="text-sm text-muted-foreground">Guardando lista...</span>
                            </div>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button
                                variant={listType === 'new' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setListType('new')}
                                className="flex-1"
                                disabled={saveListMutation.isPending}
                            >
                                Nueva lista
                            </Button>
                            <Button
                                variant={listType === 'existing' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setListType('existing')}
                                className="flex-1"
                                disabled={isLoadingLists || !existingLists || existingLists.length === 0 || saveListMutation.isPending}
                            >
                                {isLoadingLists ? 'Cargando listas...' : `Lista existente ${existingLists && existingLists.length > 0 ? `(${existingLists.length})` : ''}`}
                            </Button>
                        </div>

                        {listType === 'new' ? (
                            <div className="space-y-2">
                                <Label htmlFor="listName">Nombre de la lista</Label>
                                <Input
                                    id="listName"
                                    value={listName}
                                    onChange={(e) => setListName(e.target.value)}
                                    placeholder="Ej: Pedido de Navidad"
                                    disabled={saveListMutation.isPending}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="existingList">Seleccionar lista existente</Label>
                                {isLoadingLists ? (
                                    <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-md">
                                        <LoadingIndicator />
                                        <span className="text-sm text-muted-foreground">Cargando listas...</span>
                                    </div>
                                ) : existingLists && existingLists.length > 0 ? (
                                    <Select
                                        value={selectedExistingList}
                                        onValueChange={setSelectedExistingList}
                                        disabled={saveListMutation.isPending}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una lista" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {existingLists.map((list) => (
                                                <SelectItem key={list.id} value={list.name}>
                                                    {list.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-md">
                                        No hay listas existentes disponibles. Crea una nueva lista.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={handleCloseModal}
                                className="flex-1"
                                disabled={saveListMutation.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSaveList}
                                className="flex-1"
                                disabled={
                                    (listType === 'new' && !listName.trim()) ||
                                    (listType === 'existing' && !selectedExistingList) ||
                                    saveListMutation.isPending ||
                                    products.length === 0
                                }
                            >
                                {saveListMutation.isPending ? (
                                    <>
                                        <LoadingIndicator size={4} />
                                        <span className="ml-2">Guardando...</span>
                                    </>
                                ) : (
                                    'Guardar'
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className={`w-full h-full bg-white backdrop-blur-[2px] bg-opacity-50 absolute inset-0 z-10 transition-opacity duration-300 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'
                }`}></div>
        </div>
    );
}
