import { useQuery } from '@tanstack/react-query';
import { getDropZones } from '@/lib/configuration/dropZone';
import { IncomingDropZoneSchemaType } from '@/lib/schemas';

export function useDropZoneNames(companyId: string) {
  const {
    data: dropZones,
    isLoading,
    isError,
    error,
  } = useQuery<IncomingDropZoneSchemaType[]>({
    queryKey: ['dropZones', companyId],
    queryFn: () => getDropZones({ companyId }),
    enabled: !!companyId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getDropZoneName = (dropZoneId: string): string => {
    if (!dropZones) return dropZoneId;
    const dropZone = dropZones.find((zone) => zone.id === dropZoneId);
    return dropZone?.name || dropZoneId;
  };

  return {
    dropZones,
    isLoading,
    isError,
    error,
    getDropZoneName,
  };
}
