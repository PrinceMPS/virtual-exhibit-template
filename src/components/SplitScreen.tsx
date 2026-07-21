import type { DecodedImage } from "../S04_Group8_lib/types";
import RegionSelector from "./RegionSelector";
import { useState } from "react";
import PixelGrid from "./PixelGrid";

interface SplitScreenProps {
    currentImage: DecodedImage | null;
}

/*
 * RegionSelector holds the image so that the coordinates getting returned are accurate
 *
 */
export default function SplitScreen({ currentImage }: SplitScreenProps) {
    const [pixels, setPixels] = useState<ImageData | null>(null);

    return (
        <div className="p-6 text-white max-h-screen max-w-full overflow-x-hidden items-center flex flex-col gap-6">
            <div id="top-panels" className="w-full max-w-5xl flex flex-col md:flex-row items-start justify-center gap-6">
                <div id="image-panel" className="relative aspect-square w-full md:w-[400px] shrink-0 overflow-hidden rounded-lg bg-neutral-950">
                    {currentImage ? (
                        <RegionSelector
                            imageUrl={currentImage.url}
                            onPixelsChange={setPixels}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-400">
                            No image loaded
                        </div>
                    )}

                    <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2 bg-neutral-900/90 px-3 py-1.5 rounded-full border border-neutral-700 pointer-events-auto select-none">
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
                    </div>
                </div>

                <div id="pixel-grid-panel" className="relative w-full md:w-[400px] shrink-0">
                    <PixelGrid pixelData={pixels}></PixelGrid>
                </div>
            </div>
            <div id="bottom-documentation" className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-sky-400 mb-2">
                        How it works in math
                    </h3>
                    <p className="text-neutral-400 text-sm">
                        Explanation text here
                    </p>
                    <span>[Math Matrix Visual Placeholder]</span>
                </div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-sky-400 mb-2">
                        How it works in memory
                    </h3>
                    <p className="text-neutral-400 text-sm">
                        Explanation text here
                    </p>
                    <span>[Memory Layout Visual Placeholder]</span>
                </div>
            </div>
        </div>
    );
}
