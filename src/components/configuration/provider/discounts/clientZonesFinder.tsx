import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getClientDropZones, getDropZoneCompanies } from "@/lib/configuration/dropZone";
import { IncomingDropZoneSchemaType } from "@/lib/schemas";
import { CompanySchemaType } from "@/lib/schemas/company.schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { MdAddBusiness } from "react-icons/md";
import LoadingIndicator from "@/components/loadingIndicator";

type Props = {
    clientId: string;
    onCompanyAdded: (company: CompanySchemaType) => void;
    onMultipleCompaniesAdded?: (companies: CompanySchemaType[]) => void;
};

export default function ClientZonesFinder({ clientId, onCompanyAdded, onMultipleCompaniesAdded }: Props) {
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [selectedCompanies, setSelectedCompanies] = useState<CompanySchemaType[]>([]);

    // Query para obtener las zonas del cliente
    const { data: clientZones, isLoading: zonesLoading, isError: zonesError } = useQuery({
        queryKey: ['client-dropZones', clientId],
        queryFn: () => getClientDropZones({ clientId }),
        enabled: !!clientId,
    });

    // Query para obtener las empresas de la zona seleccionada
    const { data: zoneCompanies, isLoading: companiesLoading, isError: companiesError } = useQuery({
        queryKey: ['dropZone-companies', selectedZoneId],
        queryFn: () => getDropZoneCompanies({ dropZoneId: selectedZoneId! }),
        enabled: !!selectedZoneId,
    });

    function handleZoneSelect(zoneId: string) {
        setSelectedZoneId(zoneId);
        setSelectedCompanies([]);
    }

    function handleAddCompany(company: CompanySchemaType) {
        const exists = selectedCompanies.find(c => c.id === company.id);
        if (!exists) {
            setSelectedCompanies(prev => [...prev, company]);
            onCompanyAdded(company);
        }
    }

    function handleAddAllCompanies() {
        if (zoneCompanies && onMultipleCompaniesAdded) {
            // Filtrar empresas que no están ya seleccionadas
            const newCompanies = zoneCompanies.filter(company =>
                !selectedCompanies.find(selected => selected.id === company.id)
            );
            setSelectedCompanies(prev => [...prev, ...newCompanies]);
            onMultipleCompaniesAdded(newCompanies);
        }
    }

    if (zonesError) {
        return (
            <div className="h-fit px-5 py-2 shadow rounded-sm">
                <div className="text-sm text-destructive">Error al cargar las zonas del cliente</div>
            </div>
        );
    }

    if (zonesLoading) {
        return (
            <div className="h-fit px-5 py-2 shadow rounded-sm flex justify-between items-center">
                <LoadingIndicator />
            </div>
        );
    }

    if (!clientZones || clientZones.length === 0) {
        return (
            <div className="h-fit px-5 py-2 shadow rounded-sm">
                <div className="text-sm text-muted-foreground">El cliente no tiene zonas asignadas</div>
            </div>
        );
    }

    return (
        <div className="mb-2">
            <div className="w-full pl-2">
                <Label>Zonas del cliente</Label>
            </div>

            <div className="mt-2 space-y-2">
                {/* Lista de zonas del cliente */}
                <div className="flex flex-wrap gap-2">
                    {clientZones.map((zone: IncomingDropZoneSchemaType) => (
                        <Button
                            key={zone.id}
                            type="button"
                            variant={selectedZoneId === zone.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => zone.id && handleZoneSelect(zone.id)}
                            className="flex items-center gap-2"
                        >
                            <FiMapPin size={14} />
                            {zone.name}
                        </Button>
                    ))}
                </div>

                {/* Resultados de empresas de la zona seleccionada */}
                {selectedZoneId && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Empresas en la zona</Label>
                            {zoneCompanies && zoneCompanies.length > 0 && onMultipleCompaniesAdded && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddAllCompanies}
                                    className="flex items-center gap-1"
                                >
                                    <MdAddBusiness size={14} />
                                    Agregar todas
                                </Button>
                            )}
                        </div>

                        {companiesLoading && (
                            <div className="h-fit px-5 py-2 shadow rounded-sm flex justify-between items-center">
                                <LoadingIndicator />
                            </div>
                        )}

                        {companiesError && (
                            <div className="h-fit px-5 py-2 shadow rounded-sm">
                                <div className="text-sm text-destructive">Error al cargar las empresas</div>
                            </div>
                        )}

                        {zoneCompanies && zoneCompanies.length === 0 && (
                            <div className="h-fit px-5 py-2 shadow rounded-sm">
                                <div className="text-sm text-muted-foreground">No hay empresas en esta zona</div>
                            </div>
                        )}

                        {zoneCompanies && zoneCompanies.length > 0 && (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {zoneCompanies.map((company: CompanySchemaType) => {
                                    const isSelected = selectedCompanies.find(c => c.id === company.id) !== undefined;
                                    return (
                                        <div
                                            key={company.id}
                                            className={cn(
                                                "h-fit px-5 py-2 shadow rounded-sm flex justify-between items-center",
                                                isSelected && "bg-primary/10 border border-primary/20"
                                            )}
                                        >
                                            <div className="flex flex-col w-full text-sm">
                                                <div>Nombre: {company.name}</div>
                                                <div>Razón Social: {company.razonSocial}</div>
                                                <div>CUIT: {company.cuit}</div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant={isSelected ? "secondary" : "outlineSecondary"}
                                                size="sm"
                                                onClick={() => handleAddCompany(company)}
                                                disabled={isSelected}
                                            >
                                                {isSelected ? "Agregado" : "Agregar"}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 