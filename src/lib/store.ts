import { create } from 'zustand';
import { generateArray, shuffle } from '@/lib/randomized-array-generator';

interface StoreState {
  arrayToSort: number[];
  running: boolean;
  sortTime: number;
  setSortTime: (time: number) => void;
  resetSortTime: () => void;
  setArrayToSort: (array: number[]) => void;
  setRunning: (running: boolean) => void;
  regenerateArray: (size: number) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  arrayToSort: shuffle(generateArray(300)),
  running: false,
  sortTime: 0,

  setSortTime: (time: number) => set({ sortTime: time }),

  resetSortTime: () => set({ sortTime: 0 }),

  setArrayToSort: (array) => set({ arrayToSort: array }),

  setRunning: (running) => set({ running }),

  regenerateArray: (size) => {
    const newArray = shuffle(generateArray(size));
    set({ arrayToSort: newArray });
  },
}));
