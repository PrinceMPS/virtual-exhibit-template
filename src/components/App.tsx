import { useState, useEffect, useCallback } from "react";
import type { DecodedImage } from "../S04_Group8_lib/types";
import ImageInput from "./ImageInput";
import SplitScreen from "./SplitScreen";
// import PixelInspector from "../components/PixelInspector";
// import PixelGrid from "../components/PixelGrid";
// import ImageProcessor from "../components/ImageProcessor";
import FormatModule from "./FormatModule";
import MathVisualizer from "../components/MathVisualizer";
import PipelineVisualizer from "../components/PipelineVisualizer";
import MemoryVisualization from "../components/MemoryVisualization";
import ImageProcessor from "./ImageProcessor";
import { type Pixel } from "../S04_Group8_lib/types";

export default function App() {
    const [currentImage, setCurrentImage] = useState<DecodedImage | null>(null);
    const [processedImageData, setProcessedImageData] =
        useState<ImageData | null>(null);
    const [activeTab, setActiveTab] = useState<string>("");
    const [operationParams, setOperationParams] = useState({
        brightness: 0,
        scale: 100,
        rotate: 0,
    });
    const [hoveredPixel, setHoveredPixel] = useState<Pixel | null>(null);
    const [originalPixels, setOriginalPixels] = useState<ImageData | null>(
        null,
    );
    const [processedPixels, setProcessedPixels] = useState<ImageData | null>(
        null,
    );

    useEffect(() => {
        setProcessedImageData(null);
        setActiveTab("");
        setOperationParams({ brightness: 0, scale: 100, rotate: 0 });
    }, [currentImage?.id]);

    const handleProcessedUpdate = useCallback((data: ImageData | null) => {
        setProcessedImageData(data);
    }, []);

    const handleParamsChange = useCallback(
        (params: { brightness: number; scale: number; rotate: number }) => {
            setOperationParams(params);
        },
        [],
    );

    const handleTabChange = useCallback((tabId: string) => {
        setActiveTab(tabId);
    }, []);

    if (!currentImage) {
        return (
            <div className="w-full h-full bg-[#292929] pl-10 pr-1">
                <div className="flex h-full">
                    <div
                        className="w-[100px] h-full pl-10 pr-16 flex items-stretch"
                        style={{
                            background: `linear-gradient(to bottom, #6C9DCC 0%, #6C9DCC 20%, #647B91 20%, #647B91 40%, #5E6B78 40%, #5E6B78 60%, #3E4246 60%, #3E4246 80%, #333232 80%, #333232 100%)`,
                        }}
                    ></div>
                    <div className="flex flex-col items-center flex-1 pb-10">
                        <h2
                            className="text-[#71C6FF] font-bold text-[32px] w-full pt-10 pb-5 text-center"
                            style={{ borderBottom: "none" }}
                        >
                            How Computers See Images
                        </h2>
                        <p className="text-white text-justify w-full px-10 pb-5">
                            Every digital image undergoes a series of steps
                            before it appears on a screen. Images may be stored
                            in formats such as
                            <b> PNG, JPG/JPEG, BMP, HEIC,</b> with each using
                            different methods for organizing and compressing
                            data. However, before an image can be displayed or
                            modified, the computer must
                            <b> decode the file </b>
                            and load its contents into memory as{" "}
                            <b>pixel data</b>. Once in memory, the image is
                            represented as
                            <b> numerical values </b>
                            describing the color and transparency of each pixel,
                            allowing the computer to perform processing
                            operations regardless of the original file format.
                        </p>
                        {/* Format comparison cards: PNG, JPEG, BMP, HEIC */}
                        <div className="w-full px-10">
                            <p className="text-white text-sm pb-3">
                                Not all of these formats store their bytes the
                                same way — expand a card below to see how each
                                one actually lays out its data on disk.
                            </p>
                            <FormatModule />
                        </div>
                        <div className="flex items-center justify-center gap-4 text-white text-lg pb-5">
                            <span className="text-3xl">↓</span>
                            <span>See the process for yourself!</span>
                            <span className="text-3xl">↓</span>
                        </div>
                        <ImageInput onImageLoad={setCurrentImage} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#292929] p-10 flex flex-row">
            <div className="w-full h-full bg-[#292929] p-10 flex flex-col">
                <div className="flex flex-col h-full">
                    <ImageInput onImageLoad={setCurrentImage} hasImage={true} />
                    <SplitScreen
                        currentImage={currentImage}
                        processedImageData={processedImageData}
                        activeTab={activeTab}
                        operationParams={operationParams}
                        parentHoveredPixel={setHoveredPixel}
                        parentOriginalPixels={setOriginalPixels}
                        parentProcessedPixels={setProcessedPixels}
                    />
                </div>
                <div className="w-[95%]">
                    <h2 className="text-xl font-semibold text-sky-400 mb-1">
                        What's actually happening
                    </h2>
                    <p className="text-neutral-400 text-sm w-full text-justify">
                        Whatever pixel you're hovering above is really just four
                        numbers, but those numbers get used in two very
                        different ways depending on what you're doing with the
                        image. Here's the same pixel, viewed as an equation and
                        as raw bytes.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-sky-400 mb-2">
                            How it works in memory
                        </h3>
                        <p className="text-neutral-400 text-sm text-justify">
                            Every pixel you hover in the grid above is really
                            just 4 bytes sitting in a row in memory. Hover a
                            pixel to see its exact bytes below.
                        </p>
                        <MemoryVisualization
                            image={currentImage}
                            pixel={hoveredPixel}
                        />
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-justify text-sky-400 mb-2">
                            How it works in math
                        </h3>
                        <p className="text-neutral-400 text-sm text-justify">
                            Every transform is a small equation applied to each
                            pixel. Grayscale isn't a simple average of red,
                            green, and blue, human eyes are more sensitive to
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
                        <MathVisualizer
                            activeTab={activeTab}
                            originalPixels={originalPixels}
                            processedPixels={processedPixels}
                            params={operationParams}
                            originalWidth={currentImage?.width ?? 0}
                            originalHeight={currentImage?.height ?? 0}
                        />
                    </div>
                </div>
                <PipelineVisualizer />
            </div>

            <ImageProcessor
                imageData={currentImage.imageData}
                onTabChange={handleTabChange}
                onProcessedUpdate={handleProcessedUpdate}
                onParamsChange={handleParamsChange}
            />
        </div>
    );
}
