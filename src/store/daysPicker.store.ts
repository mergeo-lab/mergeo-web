import { create } from 'zustand';
import { PickUpSchedulesSchemaType } from '@/lib/schemas/pickUp.schema';

interface Day {
  name: string;
  value: string;
  disabled: boolean;
}

type DaysPickerState = {
  allDays: Day[];
  selectedDays: string[];
  startHour: string;
  endHour: string;
  daysAndTime: PickUpSchedulesSchemaType[];
  toggleDay: (day: string) => void;
  selectAllDays: () => void;
  unselectAllDays: () => void;
  setStartHour: (hour: string) => void;
  setEndHour: (hour: string) => void;
  addDayAndTime: (newEntry: PickUpSchedulesSchemaType) => void;
  addMultipleDaysAndTime: (newEntries: PickUpSchedulesSchemaType[]) => void;
  removeAll: () => void;
  removeById: (id: string) => void;
  reset: () => void;
};

const listOfDays: Day[] = [
  { name: 'Lunes', value: 'lunes', disabled: false },
  { name: 'Martes', value: 'martes', disabled: false },
  { name: 'Miercoles', value: 'miercoles', disabled: false },
  { name: 'Jueves', value: 'jueves', disabled: false },
  { name: 'Viernes', value: 'viernes', disabled: false },
  { name: 'Sabado', value: 'sabado', disabled: false },
];

const useDaysPickerStore = create<DaysPickerState>((set) => ({
  allDays: listOfDays,
  selectedDays: [],
  startHour: '',
  endHour: '',
  daysAndTime: [],
  toggleDay: (day: string) =>
    set((state) => {
      if (state.selectedDays.includes(day)) {
        return {
          selectedDays: state.selectedDays.filter((d) => d !== day),
        };
      } else {
        return {
          selectedDays: [...state.selectedDays, day],
        };
      }
    }),
  setStartHour: (hour: string) => set({ startHour: hour }),
  setEndHour: (hour: string) => set({ endHour: hour }),
  addDayAndTime: (newEntry: PickUpSchedulesSchemaType) =>
    set((state) => ({
      daysAndTime: [...state.daysAndTime, newEntry],
    })),
  addMultipleDaysAndTime: (newEntries: PickUpSchedulesSchemaType[]) =>
    set((state) => ({
      daysAndTime: [...state.daysAndTime, ...newEntries],
    })),
  removeAll: () =>
    set(() => ({
      daysAndTime: [],
    })),
  removeById: (id) =>
    set((state) => ({
      daysAndTime: state.daysAndTime.filter((item) => item.id !== id),
    })),
  reset: () =>
    set({
      selectedDays: [],
      startHour: '',
      endHour: '',
    }),
  selectAllDays: () =>
    set((state) => ({
      selectedDays:
        state.selectedDays.length === state.allDays.length
          ? [] // If all days are selected, deselect all
          : state.allDays.map((day) => day.value), // Otherwise, select all days
    })),
  unselectAllDays: () =>
    set(() => ({
      selectedDays: [],
    })),
}));

export default useDaysPickerStore;
