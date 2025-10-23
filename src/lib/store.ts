import { create } from "zustand";
import { generateArray, shuffle } from "@/lib/sort-utils";
import type { StoreState } from "@/lib/types";

export const useStore = create<StoreState>((set) => ({
  arrayToSort: shuffle(generateArray(300)),
  running: false,
  sortTime: 0,
  setSortTime: (sortTime) => set({ sortTime }),
  resetSortTime: () => set({ sortTime: 0 }),
  setArrayToSort: (arrayToSort) => set({ arrayToSort }),
  setRunning: (running) => set({ running }),
  regenerateArray: (size) => set({ arrayToSort: shuffle(generateArray(size)) }),
}));
