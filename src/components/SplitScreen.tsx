import type { DecodedImage } from "../S04_Group8_lib/types";
import RegionSelector from "./RegionSelector";
import { useState, useMemo, useCallback, useEffect } from "react";
import PixelGrid from "./PixelGrid";
import { type Pixel } from "../S04_Group8_lib/types";
import MemoryVisualization from "./MemoryVisualization";
import MathVisualizer from "./MathVisualizer";
import PipelineVisualizer from "./PipelineVisualizer";

interface SplitScreenProps {
    currentImage: DecodedImage | null;
    processedImageData: ImageData | null;
    activeTab: string;
    operationParams: { brightness: number; scale: number; rotate: number };
}

function imageDataToUrl(data: ImageData): string {
    const c = document.createElement("canvas");
    c.width = data.width;
    c.height = data.height;
    const ctx = c.getContext("2d");
    if (!ctx) return "";
    ctx.putImageData(data, 0, 0);
    return c.toDataURL();
}

export default function SplitScreen({
    currentImage,
    processedImageData,
    activeTab,
    operationParams,
}: SplitScreenProps) {
    const [pixels, setPixels] = useState<ImageData | null>(null);
    const [hoveredPixel, setHoveredPixel] = useState<Pixel | null>(null);
    const [originalPixels, setOriginalPixels] = useState<ImageData | null>(
        null
    );
    const [processedPixels, setProcessedPixels] = useState<ImageData | null>(
        null
    );

    const processedImageUrl = useMemo(() => {
        if (!processedImageData) return null;
        return imageDataToUrl(processedImageData);
    }, [processedImageData]);

    useEffect(() => {
        setOriginalPixels(null);
        setProcessedPixels(null);
    }, [currentImage?.id]);

    const handlePixelsChange = useCallback(
        (data: ImageData | null) => {
            setPixels(data);
            if (processedImageData) {
                setProcessedPixels(data);
            } else {
                setOriginalPixels(data);
            }
        },
        [processedImageData]
    );

    const imageUrl = processedImageUrl || currentImage?.url || "";

    return (
        <div className="p-6 text-white max-h-screen max-w-full overflow-x-hidden items-center flex flex-col gap-6">
            <PipelineVisualizer />
            <div
                id="top-panels"
                className="w-full max-w-5xl flex flex-col md:flex-row items-start justify-center gap-6"
            >
                <div
                    id="image-panel"
                    className="relative aspect-square w-full md:w-[400px] shrink-0 overflow-hidden rounded-lg bg-neutral-950"
                >
                    {currentImage ? (
                        <RegionSelector
                            imageUrl={imageUrl}
                            onPixelsChange={handlePixelsChange}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-400">
                            No image loaded
                        </div>
                    )}
                </div>

                <div id="pixel-grid-panel">
                    <PixelGrid
                        pixelData={pixels}
                        onPixelChange={setHoveredPixel}
                    ></PixelGrid>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-justify text-sky-400 mb-1">
                    What's actually happening
                </h2>
                <p className="text-neutral-400 text-justify text-sm max-w-2xl">
                    Whatever pixel you're hovering above is really just four
                    numbers, but those numbers get used in two very different
                    ways depending on what you're doing with the image. Here's
                    the same pixel, viewed as an equation and as raw bytes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-justify text-sky-400 mb-2">
                        How it works in math
                    </h3>
                    <p className="text-neutral-400 text-justify text-sm">
                        Every transform is a small equation applied to each
                        pixel. Grayscale isn't a simple average of red, green,
                        and blue, human eyes are more sensitive to green, so a
                        proper grayscale value is the weighted sum 0.299R +
                        0.587G + 0.114B. Brightness is even simpler: add a
                        constant to every channel and clamp the result between 0
                        and 255 so colors don't wrap around. Rotation works
                        differently, instead of touching color values, it
                        recalculates where each pixel lands using a rotation
                        matrix, then works backward to find which original pixel
                        maps to each new coordinate. The formulas below break
                        down each one step by step.
                    </p>
                    <MathVisualizer
                        activeTab={activeTab}
                        originalPixels={originalPixels}
                        processedPixels={processedPixels}
                        params={operationParams}
                        originalWidth={currentImage?.width ?? 0}
                        originalHeight={currentImage?.height ?? 0}
                    />
                </div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-justify text-sky-400 mb-2">
                        How it works in memory
                    </h3>
                    <p className="text-neutral-400 text-justify text-sm">
                        Every pixel you hover in the grid above is really just 4
                        bytes sitting in a row in memory. Hover a pixel to see
                        its exact bytes below.
                    </p>
                    <MemoryVisualization
                        image={currentImage}
                        pixel={hoveredPixel}
                    />
                </div>
            </div>
        </div>
    );
}
