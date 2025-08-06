import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDropZones, getDropZoneCompanies } from "@/lib/configuration/dropZone";
import { IncomingDropZoneSchemaType } from "@/lib/schemas";
import { CompanySchemaType } from "@/lib/schemas/company.schema";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { MdAddBusiness } from "react-icons/md";
import LoadingIndicator from "@/components/loadingIndicator";
import { useAuth } from "@/context/AuthContext";

type Props = {
    onCompanyAdded: (company: CompanySchemaType) => void;
    onMultipleCompaniesAdded?: (companies: CompanySchemaType[]) => void;
};

export default function ZoneSelector({ onCompanyAdded, onMultipleCompaniesAdded }: Props) {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [selectedCompanies, setSelectedCompanies] = useState<CompanySchemaType[]>([]);

    // Query para obtener todas las zonas disponibles
    const { data: allZones, isLoading: zonesLoading, isError: zonesError } = useQuery({
        queryKey: ['all-dropZones', companyId],
        queryFn: () => getDropZones({ companyId }),
        enabled: !!companyId,
    });

    // Query para obtener las empresas de la zona seleccionada
    const { data: zoneCompanies, isLoading: companiesLoading, isError: companiesError } = useQuery({
        queryKey: ['dropZone-companies', selectedZoneId],
        queryFn: () => {
            console.log('ZoneSelector - Making API call for dropZoneId:', selectedZoneId);
            return getDropZoneCompanies({ dropZoneId: selectedZoneId! });
        },
        enabled: !!selectedZoneId,
    });

    // Filtrar empresas que no han sido agregadas aún
    const availableCompanies = zoneCompanies?.filter(company =>
        !selectedCompanies.find(selected => selected.id === company.id)
    ) || [];

    // Debug logs
    console.log('ZoneSelector - companyId:', companyId);
    console.log('ZoneSelector - allZones:', allZones);
    console.log('ZoneSelector - selectedZoneId:', selectedZoneId);
    console.log('ZoneSelector - zoneCompanies:', zoneCompanies);
    console.log('ZoneSelector - availableCompanies:', availableCompanies);
    console.log('ZoneSelector - selectedCompanies:', selectedCompanies);
    console.log('ZoneSelector - companiesLoading:', companiesLoading);
    console.log('ZoneSelector - companiesError:', companiesError);

    function handleZoneSelect(zoneId: string) {
        console.log('ZoneSelector - handleZoneSelect called with:', zoneId);
        setSelectedZoneId(zoneId);
        setSelectedCompanies([]);
    }

    function handleAddCompany(company: CompanySchemaType) {
        setSelectedCompanies(prev => [...prev, company]);
        onCompanyAdded(company);
    }

    function handleAddAllCompanies() {
        if (availableCompanies && onMultipleCompaniesAdded) {
            setSelectedCompanies(prev => [...prev, ...availableCompanies]);
            onMultipleCompaniesAdded(availableCompanies);
        }
    }

    if (zonesError) {
        return (
            <div className="h-fit px-5 py-2 shadow rounded-sm">
                <div className="text-sm text-destructive">Error al cargar las zonas</div>
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

    if (!allZones || allZones.length === 0) {
        return (
            <div className="h-fit px-5 py-2 shadow rounded-sm">
                <div className="text-sm text-muted-foreground">No hay zonas disponibles</div>
            </div>
        );
    }

    return (
        <div className="mb-2">
            <div className="w-full pl-2">
                <Label>Buscar por zona</Label>
            </div>

            <div className="mt-2 space-y-2">
                {/* Selector de zonas */}
                <div className="flex items-center gap-2">
                    <FiMapPin size={16} className="text-muted-foreground" />
                    <Select onValueChange={handleZoneSelect} value={selectedZoneId || ""}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona una zona" />
                        </SelectTrigger>
                        <SelectContent>
                            {allZones.map((zone: IncomingDropZoneSchemaType) => (
                                <SelectItem key={zone.id} value={zone.id!}>
                                    {zone.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Resultados de empresas de la zona seleccionada */}
                {selectedZoneId && (
                    <div className="my-4">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Clientes en la zona</Label>
                            {availableCompanies && availableCompanies.length > 0 && onMultipleCompaniesAdded && (
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={handleAddAllCompanies}
                                    className="flex items-center gap-1 text-primary hover:text-primary/80"
                                >
                                    <MdAddBusiness size={14} />
                                    Agregar todos
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
                                <div className="text-sm text-destructive">Error al cargar los clientes</div>
                            </div>
                        )}

                        {availableCompanies && availableCompanies.length === 0 && zoneCompanies && zoneCompanies.length > 0 && (
                            <div className="h-fit px-5 py-2 shadow rounded-sm">
                                <div className="text-sm text-muted-foreground">Todos los clientes de esta zona han sido agregados</div>
                            </div>
                        )}

                        {zoneCompanies && zoneCompanies.length === 0 && (
                            <div className="h-fit px-5 py-2 shadow rounded-sm">
                                <div className="text-sm text-muted-foreground">No hay clientes en esta zona</div>
                            </div>
                        )}

                        {availableCompanies && availableCompanies.length > 0 && (
                            <div className="space-y-1 pt-2 max-h-96 overflow-y-auto">
                                {availableCompanies.map((company: CompanySchemaType) => (
                                    <div
                                        key={company.id}
                                        className="h-fit px-5 py-1 border-t-2 border-t-border rounded-sm flex justify-between items-center"
                                    >
                                        <div className="flex flex-col w-full text-sm">
                                            <div>Nombre: {company.name}</div>
                                            <div>Razón Social: {company.razonSocial}</div>
                                            <div>CUIT: {company.cuit}</div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outlineSecondary"
                                            size="sm"
                                            onClick={() => handleAddCompany(company)}
                                        >
                                            Agregar
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 