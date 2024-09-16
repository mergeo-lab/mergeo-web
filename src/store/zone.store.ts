import { create } from 'zustand';

type ZoneState = {
  zone: google.maps.LatLngLiteral[];
  setZone: (coor: google.maps.LatLngLiteral[]) => void;
  removeZone: () => void;
};

const useZoneStore = create<ZoneState>((set) => ({
  zone: [],
  setZone: (coor: google.maps.LatLngLiteral[]) => set({ zone: coor }),
  removeZone: () => set(() => ({ zone: [] })),
}));

export default useZoneStore;
