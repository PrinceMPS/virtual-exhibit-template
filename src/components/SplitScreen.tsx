import type { DecodedImage } from "../S04_Group8_lib/types";
import RegionSelector from "./RegionSelector";
import { useState } from "react";
import PixelGrid from "./PixelGrid";
import { type Pixel } from "../S04_Group8_lib/types";
import MemoryVisualization from "./MemoryVisualization";

interface SplitScreenProps {
    currentImage: DecodedImage | null;
}

/*
 * RegionSelector holds the image so that the coordinates getting returned are accurate
 *
 */
export default function SplitScreen({ currentImage }: SplitScreenProps) {
    const [pixels, setPixels] = useState<ImageData | null>(null);
    const [hoveredPixel, setHoveredPixel] = useState<Pixel | null>(null);

    return (
        <div className="p-6 bg-neutral-900 text-white min-h-screen min-w-screen flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-semibold text-sky-400 mb-1">
                    Zoom into the pixels
                </h2>
                <p className="text-neutral-400 text-sm max-w-2xl">
                    Drag a selection box anywhere on your image to pick a
                    region. On the right, that region is blown up into a
                    grid where each square is one pixel — hover over any
                    square to see exactly what numbers the computer stored
                    for that single point of color.
                </p>
            </div>

            {/* <div className="flex gap-4">
                <button
                    type="button"
                    className="px-4 py-2 bg-sky-500 rounded font-medium"
                    onClick={onChangeImage}
                >
                    Change Image
                </button>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-square w-full overflow-hidden">
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

                <div id="pixel-grid-panel">
                    <PixelGrid
                        pixelData={pixels}
                        onPixelChange={setHoveredPixel}
                    ></PixelGrid>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-sky-400 mb-1">
                    What's actually happening
                </h2>
                <p className="text-neutral-400 text-sm max-w-2xl">
                    Whatever pixel you're hovering above is really just
                    four numbers, but those numbers get used in two very
                    different ways depending on what you're doing with the
                    image. Here's the same pixel, viewed as an equation and
                    as raw bytes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-sky-400 mb-2">
                        How it works in math
                    </h3>
                    <p className="text-neutral-400 text-sm">
                        Every transform is a small equation applied to each
                        pixel. Grayscale isn't a simple average of red,
                        green, and blue,  human eyes are more sensitive to
                        green, so a proper grayscale value is the weighted
                        sum 0.299R + 0.587G + 0.114B. Brightness is even
                        simpler: add a constant to every channel and clamp
                        the result between 0 and 255 so colors don't wrap
                        around. Rotation works differently, instead of
                        touching color values, it recalculates where each
                        pixel lands using a rotation matrix, then works
                        backward to find which original pixel maps to each
                        new coordinate. The formulas below break down each
                        one step by step.
                    </p>
                    <span>[Math Matrix Visual Placeholder]</span>
                </div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-sky-400 mb-2">
                        How it works in memory
                    </h3>
                    <p className="text-neutral-400 text-sm">
                        Every pixel you hover in the grid above is really
                        just 4 bytes sitting in a row in memory. Hover a
                        pixel to see its exact bytes below.
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