import { useState, useEffect, useCallback } from "react";
import type { DecodedImage } from "../S04_Group8_lib/types";
import ImageInput from "./ImageInput";
import SplitScreen from "./SplitScreen";
// import PixelInspector from "../components/PixelInspector";
// import PixelGrid from "../components/PixelGrid";
// import ImageProcessor from "../components/ImageProcessor";
import FormatModule from "./FormatModule";
// import MathVisualizer from "../components/MathVisualizer";
// import PipelineVisualizer from "../components/PipelineVisualizer";
// import MemoryVisualization from "../components/MemoryVisualization";
import ImageProcessor from "./ImageProcessor";

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
        []
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
                            <b> PNG, JPG/JPEG, BMP, HEIC and WEBP</b> with each
                            using different methods for organizing and
                            compressing data. Before an image can be displayed
                            or modified, the computer must
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
                            <p className="text-white text-justify text-sm pb-3">
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
        <div className="w-full h-full bg-[#292929] p-10">
            <ImageInput onImageLoad={setCurrentImage} hasImage={true} />
            <SplitScreen
                currentImage={currentImage}
                processedImageData={processedImageData}
                activeTab={activeTab}
                operationParams={operationParams}
            />
            <ImageProcessor
                imageData={currentImage.imageData}
                onTabChange={handleTabChange}
                onProcessedUpdate={handleProcessedUpdate}
                onParamsChange={handleParamsChange}
            />
        </div>
    );
}
