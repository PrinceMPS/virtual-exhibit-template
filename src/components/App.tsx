import { useState } from "react";
import type { DecodedImage } from "../S04_Group8_lib/types";
import ImageInput from "./ImageInput";
import SplitScreen from "./SplitScreen";
// import PixelInspector from "../components/PixelInspector";
// import PixelGrid from "../components/PixelGrid";
// import ImageProcessor from "../components/ImageProcessor";
// import FormatModule from "../components/FormatModule";
// import MathVisualizer from "../components/MathVisualizer";
// import PipelineVisualizer from "../components/PipelineVisualizer";
// import MemoryVisualization from "../components/MemoryVisualization";

/**
 * The main exhibit application component that manages the state of the current image and renders the appropriate UI based on whether an image is loaded or not.
 *
 * Sidenote:
 * apparently we can't put this in the index.mdx file because of the way Astro handles JSX components. So we have to put it in a separate file and import it into index.mdx.
 *
 * @returns {JSX.Element}
 */
export default function App() {
    const [currentImage, setCurrentImage] = useState<DecodedImage | null>(null);

    if (!currentImage) {
        return (
            <div className="w-full h-full bg-[#292929] p-10">
                <div className="flex h-full">
                    <div className="h-full pl-10 pr-16 flex items-stretch">
                        <div
                            className="w-[100px] h-full"
                            style={{
                                background: `linear-gradient(to bottom, #6C9DCC 0%, #6C9DCC 20%, #647B91 20%, #647B91 40%, #5E6B78 40%, #5E6B78 60%, #3E4246 60%, #3E4246 80%, #333232 80%, #333232 100%)`,
                            }}
                        ></div>
                    </div>
                    <div className="flex flex-col gap-10 items-center flex-1">
                        <h1 className="text-[#71C6FF] font-bold text-[32px]">
                            How Computers See Images
                        </h1>
                        <p className="text-white text-justify m-10">
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
                        <ImageInput onImageLoad={setCurrentImage} />
                    </div>
                </div>
            </div>
        );
    }

    //Interactible Page: SplitScreen with PixelGrid and PixelInspector
    return (
        <div>
            {/* SplitScreen: original canvas + PixelGrid/PixelInspector */}
            <SplitScreen currentImage={currentImage} />
        </div>
    );
}
