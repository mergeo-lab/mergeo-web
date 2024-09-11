import { create } from 'zustand';
import { DropZoneSchemaType } from '@/lib/configuration/schemas/dropZone.schemas';

type DropZonesState = {
  dropZone: DropZoneSchemaType[];
  addDropZone: (dropZone: DropZoneSchemaType) => void;
  addMultipleDropZones: (dropZone: DropZoneSchemaType[]) => void;
  removeDropZone: (id: string) => void;
  removeAllDropZones: () => void;
};

const UseDropZonesStore = create<DropZonesState>((set) => ({
  dropZone: [],
  addDropZone: (dropZone) =>
    set((state) => {
      if (
        !state.dropZone.some(
          (existingDropZone) => existingDropZone.id === dropZone.id
        )
      ) {
        return {
          dropZone: [...state.dropZone, dropZone],
        };
      }
      return state;
    }),
  removeDropZone: (id) =>
    set((state) => ({
      dropZone: state.dropZone.filter((dropZone) => dropZone.id !== id),
    })),
  addMultipleDropZones: (dropZone) => set({ dropZone }),
  removeAllDropZones: () =>
    set(() => ({
      dropZone: [],
    })),
}));

export default UseDropZonesStore;
