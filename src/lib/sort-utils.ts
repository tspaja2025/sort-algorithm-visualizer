import { CONFIG } from "@/lib/config";

export const computeRealDelay = (delay: number) =>
  CONFIG.delayFactors.reduce((res, item) => {
    const { max, factor } = item;
    if (delay <= max) {
      const precise =
        "precise" in item && typeof item.precise === "boolean"
          ? item.precise
          : false;

      return precise
        ? Math.round(delay * factor * 10) / 10
        : Math.round(delay * factor);
    }
    return res;
  }, delay);
