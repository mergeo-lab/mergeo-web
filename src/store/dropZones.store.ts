import { create } from 'zustand';
import { DropZoneSchemaType, IncomingDropZoneSchemaType } from '@/lib/schemas';
import { transformToLatLng } from '@/lib/utils';

type DropZonesState = {
  dropZones: DropZoneSchemaType[];
  addDropZone: (dropZone: DropZoneSchemaType) => void;
  addMultipleDropZones: (dropZone: DropZoneSchemaType[]) => void;
  addMultipleIncomingDropZoneSchema: (
    dropZones: IncomingDropZoneSchemaType[]
  ) => void;
  removeDropZone: (id: string) => void;
  editDropZone: (
    id: string,
    updatedDropZone: Partial<DropZoneSchemaType>
  ) => void;
  getDropZoneById: (id: string) => DropZoneSchemaType | undefined;
  removeAllDropZones: () => void;
};

const UseDropZonesStore = create<DropZonesState>((set, get) => ({
  dropZones: [],
  addDropZone: (dropZone) =>
    set((state) => {
      if (
        !state.dropZones.some(
          (existingDropZone) => existingDropZone.id === dropZone.id
        )
      ) {
        return {
          dropZones: [...state.dropZones, dropZone],
        };
      }
      return state;
    }),
  removeDropZone: (id) =>
    set((state) => ({
      dropZones: state.dropZones.filter((dropZone) => dropZone.id !== id),
    })),
  addMultipleDropZones: (dropZones) => set({ dropZones }),
  editDropZone: (id, updatedDropZone) =>
    set((state) => ({
      dropZones: state.dropZones.map((dropZone) =>
        dropZone.id === id ? { ...dropZone, ...updatedDropZone } : dropZone
      ),
    })),
  addMultipleIncomingDropZoneSchema: (incomingDropZones) => {
    const googleZones = incomingDropZones.map((dz) => ({
      ...dz, // Spread the rest of the zone's properties
      zone: {
        ...dz.zone, // Spread the properties of the zone
        coordinates: transformToLatLng(dz.zone.coordinates), // Transform the coordinates
      },
    }));

    set(() => ({ dropZones: googleZones }));
  },
  getDropZoneById: (id) =>
    get().dropZones.find((dropZone) => dropZone.id === id),

  removeAllDropZones: () =>
    set(() => ({
      dropZones: [],
    })),
}));

export default UseDropZonesStore;
