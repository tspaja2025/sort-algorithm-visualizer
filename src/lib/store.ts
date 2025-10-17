import { create } from "zustand";
import { generateArray, shuffle } from "@/lib/helpers";
import type { StoreState } from "@/lib/types";

export const useStore = create<StoreState>((set) => {
  const update = (partial: Partial<StoreState>) => set(partial);
  return {
    arrayToSort: shuffle(generateArray(300)),
    running: false,
    sortTime: 0,
    setSortTime: (sortTime) => update({ sortTime }),
    resetSortTime: () => update({ sortTime: 0 }),
    setArrayToSort: (arrayToSort) => update({ arrayToSort }),
    setRunning: (running) => update({ running }),
    regenerateArray: (size) =>
      update({ arrayToSort: shuffle(generateArray(size)) }),
  };
});
