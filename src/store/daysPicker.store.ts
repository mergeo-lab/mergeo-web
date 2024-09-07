import { create } from 'zustand';
import { PickUpDaysSchemaType } from '@/lib/configuration/schemas/pickUp.schema';

interface Day {
  name: string;
  value: string;
  disabled: boolean;
}

type DaysPickerState = {
  allDays: Day[];
  day: string;
  startHour: string;
  endHour: string;
  daysAndTime: PickUpDaysSchemaType[];
  setDay: (day: string) => void;
  setStartHour: (hour: string) => void;
  setEndHour: (hour: string) => void;
  addDayAndTime: (newEntry: PickUpDaysSchemaType) => void;
  addMultipleDaysAndTime: (newEntries: PickUpDaysSchemaType[]) => void;
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
  day: 'lunes',
  startHour: '',
  endHour: '',
  daysAndTime: [],
  setDay: (day: string) => set({ day }),
  setStartHour: (hour: string) => set({ startHour: hour }),
  setEndHour: (hour: string) => set({ endHour: hour }),
  addDayAndTime: (newEntry: PickUpDaysSchemaType) =>
    set((state) => ({
      daysAndTime: [...state.daysAndTime, newEntry],
    })),
  addMultipleDaysAndTime: (newEntries: PickUpDaysSchemaType[]) =>
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
      day: 'lunes',
      startHour: '',
      endHour: '',
    }),
}));

export default useDaysPickerStore;
