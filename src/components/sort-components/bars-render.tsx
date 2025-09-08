"use client";

import { Render, SortElement } from "@/lib/types";
import { Canvas } from "@/components/canvas/canvas";
import { Layer } from "@/components/canvas/layer";

export function BarsRender({
    bars
}: { bars: Array<SortElement> }) {
    const render: Render = ({ context, width, height }) => {
        context.fillStyle = "base-100";
        context.fillRect(0, 0, width, height);

        const spaceWidth = 0.2;
        const barWidth = (width - (bars.length - 1) * spaceWidth) / bars.length;
        const oneStepSize = height / bars.length;

        for (let currentBar = 0; currentBar < bars.length; currentBar++) {
            const barSize = oneStepSize * bars[currentBar].value;
            if (bars[currentBar].access) {
                context.fillStyle = "accent";
            } else if (currentBar === bars[currentBar].value - 1) {
                context.fillStyle = "primary";
            } else {
                context.fillStyle = "neutral";
            }

            context.fillRect(
                currentBar * (barWidth + spaceWidth),
                height - barSize,
                barWidth,
                barSize
            );
        }
    };

    return (
        <Canvas autoplay>
            <Layer {render} />
        </Canvas>
    )
}