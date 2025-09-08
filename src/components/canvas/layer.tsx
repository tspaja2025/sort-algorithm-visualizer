import { LayerProps } from "@/lib/types";

export function Layer() {
    let layer: LayerProps;
    const layerId = register(layer);
    return <div data-layer-id={layerId}></div>
}