import { useState } from "react";
import type { DecodedImage } from "../S04_Group8_lib/types";
import ImageInput from "./ImageInput.tsx";
import SplitScreen from "./SplitScreen.jsx";
// import PixelInspector from "../components/PixelInspector.jsx";
// import PixelGrid from "../components/PixelGrid.jsx";
// import ImageProcessor from "../components/ImageProcessor.jsx";
// import FormatModule from "../components/FormatModule.jsx";
// import MathVisualizer from "../components/MathVisualizer.jsx";
import RegionSelector from "./RegionSelector.jsx";
// import PipelineVisualizer from "../components/PipelineVisualizer.jsx";
// import MemoryVisualization from "../components/MemoryVisualization.jsx";

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
            <div className="w-full h-full bg-[#111111] p-10">
                <div className=" flex flex-col gap-10 items-center">
                    {/* color swatch strip goes here */}
                    <h1 className="text-blue-400 font-bold text-[32px]">
                        How Computers See Images
                    </h1>
                    <p className="text-white text-justify m-10">
                        Every digital image undergoes a series of steps before
                        it appears on a screen. Images may be stored in formats
                        such as
                        <b> PNG, JPG/JPEG, BMP, HEIC,</b> with each using
                        different methods for organizing and compressing data.
                        However, before an image can be displayed or modified,
                        the computer must
                        <b> decode the file </b>
                        and load its contents into memory as <b>pixel data</b>.
                        Once in memory, the image is represented as
                        <b> numerical values </b>
                        describing the color and transparency of each pixel,
                        allowing the computer to perform processing operations
                        regardless of the original file format.
                    </p>
                    <ImageInput onImageLoad={setCurrentImage} />
                </div>
            </div>
        );
    }

    // not sure if this is right/if this is where each component is meant to go.
    return (
        <div>
            <button onClick={() => setCurrentImage(null)}>Change image</button>
            <div>
                {/* SplitScreen: original canvas + PixelGrid/PixelInspector */}
                <SplitScreen />
            </div>
        </div>
    );
}
