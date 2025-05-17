import { create } from 'zustand';

type ZoneState = {
  zone: google.maps.LatLngLiteral[];
  setZone: (coor: google.maps.LatLngLiteral[]) => void;
  removeZone: () => void;
};

const useZoneStore = create<ZoneState>((set, get) => ({
  zone: [],
  setZone: (coor: google.maps.LatLngLiteral[]) => {
    const prevZone = get().zone;
    // Check length difference
    if (prevZone.length !== coor.length) {
      set({ zone: coor });
      return;
    }
    // Check coordinate differences
    for (let i = 0; i < coor.length; i++) {
      if (prevZone[i].lat !== coor[i].lat || prevZone[i].lng !== coor[i].lng) {
        set({ zone: coor });
        return;
      }
    }
    // Coordinates are the same, do not update state to prevent rerenders
  },
  removeZone: () => set(() => ({ zone: [] })),
}));

export default useZoneStore;
