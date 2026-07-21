import { useState, useEffect, useRef, useCallback } from "react";
import {
    grayscale,
    brightness,
    invert,
    scale,
    rotate,
} from "../lib/imageProcessing";

const TABS = [
    { id: "grayscale", label: "Grayscale" },
    { id: "brightness", label: "Brightness" },
    { id: "invert", label: "Invert" },
    { id: "scale", label: "Scale" },
    { id: "rotate", label: "Rotate" },
];

const CANVAS_SIZE = 320;

export default function ImageProcessor({
    imageData,
    onTabChange,
    onProcessedUpdate,
    onParamsChange,
}) {
    const [activeTab, setActiveTab] = useState("");
    const [brightnessVal, setBrightnessVal] = useState(0);
    const [scaleVal, setScaleVal] = useState(100);
    const [rotateVal, setRotateVal] = useState(0);
    const [processedData, setProcessedData] = useState(null);
    const canvasRef = useRef(null);

    const applyTransform = useCallback(() => {
        if (!imageData || !activeTab) return;

        const src = processedData || imageData;
        const copy = new ImageData(
            new Uint8ClampedArray(src.data),
            src.width,
            src.height,
        );

        let result;
        switch (activeTab) {
            case "grayscale":
                result = grayscale(copy);
                break;
            case "brightness":
                result = brightness(copy, Math.round(brightnessVal * 2.55));
                break;
            case "invert":
                result = invert(copy);
                break;
            case "scale":
                result = scale(copy, scaleVal / 100, scaleVal / 100);
                break;
            case "rotate":
                result = rotate(copy, rotateVal);
                break;
            default:
                return;
        }

        setProcessedData(result);
        if (onProcessedUpdate) onProcessedUpdate(result);
    }, [imageData, processedData, activeTab, brightnessVal, scaleVal, rotateVal, onProcessedUpdate]);

    const resetImage = useCallback(() => {
        setProcessedData(null);
        if (onProcessedUpdate) onProcessedUpdate(null);
    }, [onProcessedUpdate]);

    const handleTabChange = useCallback(
        (tabId) => {
            setActiveTab(tabId);
            if (onTabChange) onTabChange(tabId);
        },
        [onTabChange],
    );

    const reportParams = useCallback(
        (bri, sca, rot) => {
            if (onParamsChange)
                onParamsChange({
                    brightness: bri,
                    scale: sca,
                    rotate: rot,
                });
        },
        [onParamsChange],
    );

    useEffect(() => {
        setProcessedData(null);
        setActiveTab("");
        setBrightnessVal(0);
        setScaleVal(100);
        setRotateVal(0);
        reportParams(0, 100, 0);
    }, [imageData, reportParams]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const src = processedData || imageData;
        if (!src) return;

        const srcW = src.width;
        const srcH = src.height;
        const scale = Math.min(CANVAS_SIZE / srcW, CANVAS_SIZE / srcH, 1);
        const dispW = Math.round(srcW * scale);
        const dispH = Math.round(srcH * scale);

        canvas.width = dispW;
        canvas.height = dispH;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = srcW;
        tempCanvas.height = srcH;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;
        tempCtx.putImageData(src, 0, 0);

        ctx.drawImage(tempCanvas, 0, 0, dispW, dispH);
    }, [imageData, processedData]);

    if (!imageData) {
        return null;
    }

    const hasProcessing = processedData !== null;

    return (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4">
            <h3 className="text-lg font-semibold text-sky-400 mb-3">
                Image Processor
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabChange(tab.id)}
                        className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? "bg-sky-500 text-white"
                                : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0 flex items-center justify-center bg-neutral-900 rounded border border-neutral-600 p-2">
                    <canvas
                        ref={canvasRef}
                        className="max-w-full h-auto"
                        style={{
                            maxWidth: `${CANVAS_SIZE}px`,
                            maxHeight: `${CANVAS_SIZE}px`,
                        }}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-3">
                    {activeTab ? (
                        <div className="flex-1 space-y-3">
                            <p className="text-sm text-neutral-400">
                                {activeTab === "grayscale" &&
                                    "Convert the image to grayscale using standard luminance weighting."}
                                {activeTab === "brightness" &&
                                    "Adjust the overall brightness of the image."}
                                {activeTab === "invert" &&
                                    "Invert all colors in the image."}
                                {activeTab === "scale" &&
                                    "Resize the image by a uniform scale factor."}
                                {activeTab === "rotate" &&
                                    "Rotate the image by a given angle."}
                            </p>

                            {activeTab === "brightness" && (
                                <div>
                                    <label className="text-sm text-neutral-300 block mb-1">
                                        Brightness: {brightnessVal}
                                    </label>
                                    <input
                                        type="range"
                                        min="-100"
                                        max="100"
                                        value={brightnessVal}
                                        onChange={(e) => {
                                            const v = Number(e.target.value);
                                            setBrightnessVal(v);
                                            reportParams(v, scaleVal, rotateVal);
                                        }}
                                        className="w-full accent-sky-500"
                                    />
                                </div>
                            )}

                            {activeTab === "scale" && (
                                <div>
                                    <label className="text-sm text-neutral-300 block mb-1">
                                        Scale: {scaleVal}%
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="200"
                                        value={scaleVal}
                                        onChange={(e) => {
                                            const v = Number(e.target.value);
                                            setScaleVal(v);
                                            reportParams(brightnessVal, v, rotateVal);
                                        }}
                                        className="w-full accent-sky-500"
                                    />
                                </div>
                            )}

                            {activeTab === "rotate" && (
                                <div>
                                    <label className="text-sm text-neutral-300 block mb-1">
                                        Angle: {rotateVal}°
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={rotateVal}
                                        onChange={(e) => {
                                            const v = Number(e.target.value);
                                            setRotateVal(v);
                                            reportParams(brightnessVal, scaleVal, v);
                                        }}
                                        className="w-full accent-sky-500"
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={applyTransform}
                                className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded font-medium transition-colors"
                            >
                                Apply {TABS.find((t) => t.id === activeTab)?.label || activeTab}
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-500 italic">
                            Select an operation above to begin.
                        </p>
                    )}

                    <div className="mt-auto pt-3 border-t border-neutral-700">
                        <button
                            type="button"
                            onClick={resetImage}
                            disabled={!hasProcessing}
                            className="px-4 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Reset to Original
                        </button>
                        {hasProcessing && (
                            <span className="ml-3 text-xs text-green-400">
                                ✓ Processed
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
