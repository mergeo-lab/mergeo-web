import { create } from 'zustand';

type LoginState = {
  startAnimation: boolean;
  endAnimation: boolean;
  setStartAnimation: (value: boolean) => void;
  setEndAnimation: (value: boolean) => void;
};

const UseLoginStore = create<LoginState>((set) => ({
  startAnimation: false,
  endAnimation: false,
  setStartAnimation: (value: boolean) => set({ startAnimation: value }),
  setEndAnimation: (value: boolean) => set({ endAnimation: value }),
}));

export default UseLoginStore;
