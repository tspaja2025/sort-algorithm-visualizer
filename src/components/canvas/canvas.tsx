"use client";

import LayerManager from "@/lib/layer-manager";
import { CanvasContext, CanvasProps } from "@/lib/types";
import { useState } from "react";

export function Canvas({
    width: _width,
    height: _height,
    pixelRatio: _pixelRatio,
    class: className,
    style = '',
    autoplay = false,
    autoclear = true,
    layerEvents = false,
    onresize,
    contextSettings,
    children,
    ...handlers
}: CanvasProps) {

    let canvas: HTMLCanvasElement;
    let context: CanvasContext;
    let layerRef: HTMLDivElement;

    let [devicePixelRatio, setDevicePixelRatio] = useState(2);
    let [canvasWidth, setCanvasWidth] = useState(0);
    let [canvasHeight, setCanvasHeight] = useState(0);

    const width = $derived(_width ?? canvasWidth);
    const height = $derived(_height ?? canvasHeight);

    const pixelRatio = $derived.by(() => {
        if (devicePixelRatio && _pixelRatio === 'auto')
            return getMaxPixelRatio(width, height, devicePixelRatio);

        if (_pixelRatio && _pixelRatio !== 'auto') return _pixelRatio;

        return devicePixelRatio;
    });

    const manager = new LayerManager({
        get width() {
            return width;
        },
        get height() {
            return height;
        },
        get pixelRatio() {
            return pixelRatio;
        },
        get autoplay() {
            return autoplay;
        },
        get autoclear() {
            return autoclear;
        },
        get layerEvents() {
            return layerEvents;
        },
        get onresize() {
            return onresize;
        },
        handlers,
    });

    onMount(() => {
        if (layerEvents) {
            context = createHitCanvas(canvas, contextSettings);
        } else {
            context = canvas.getContext('2d', contextSettings)!;
        }

        manager.init(context, layerRef);
    });

    const redraw = () => manager.redraw();
    export { redraw, canvas, context };

    return (
        <>
            <canvas
                bind:this={canvas}
                bind:clientWidth={canvasWidth}
                bind:clientHeight={canvasHeight}
                class={className}
                width={width * pixelRatio}
                height={height * pixelRatio}
                style={style}
                style:width={_width ? `${_width}px` : '100%'}
                style:height={_height ? `${_height}px` : '100%'}
                {...manager.createEventHandlers()}
            ></canvas>

            <div style={{ display: "none" }} bind:this={layerRef}>
                {children}
            </div>
        </>
    )
}