import { LayerProps } from "@/lib/types";

export const REGISTER_KEY = Symbol('register');

export const register = (layer: LayerProps) => {
  const register = getContext<LayerManager['register']>(REGISTER_KEY);
  return register(layer);
};