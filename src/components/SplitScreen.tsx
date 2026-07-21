import type { DecodedImage } from "../S04_Group8_lib/types";
import RegionSelector from "./RegionSelector";
import { useState, useMemo, useCallback, useEffect } from "react";
import PixelGrid from "./PixelGrid";
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
    const [originalPixels, setOriginalPixels] = useState<ImageData | null>(
        null,
    );
    const [processedPixels, setProcessedPixels] = useState<ImageData | null>(
        null,
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
        [processedImageData],
    );

    const imageUrl = processedImageUrl || currentImage?.url || "";

    return (
        <div className="p-6 text-white max-h-screen max-w-full overflow-x-hidden items-center flex flex-col gap-6">
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

                    {/* <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2 bg-neutral-900/90 px-3 py-1.5 rounded-full border border-neutral-700 pointer-events-auto select-none">
                        <button
                            type="button"
                            title="Rotate Clockwise"
                            className="p-1.5 text-neutral-300"
                        >
                            ↻
                        </button>
                        <button
                            type="button"
                            title="Zoom Out"
                            className="p-1.5 text-neutral-300"
                        >
                            −
                        </button>
                        <button
                            type="button"
                            title="Zoom In"
                            className="p-1.5 text-neutral-300"
                        >
                            +
                        </button>
                    </div> */}
                </div>

                <div
                    id="pixel-grid-panel"
                    className="relative w-full md:w-[400px] shrink-0"
                >
                    <PixelGrid pixelData={pixels} />
                </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <MathVisualizer
                    activeTab={activeTab}
                    originalPixels={originalPixels}
                    processedPixels={processedPixels}
                    params={operationParams}
                    originalWidth={currentImage?.width ?? 0}
                    originalHeight={currentImage?.height ?? 0}
                />
                <PipelineVisualizer />
            </div>
        </div>
    );
}
