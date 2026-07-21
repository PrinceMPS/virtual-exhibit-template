import { useMemo } from "react";

function Matrix2x2({ rows }) {
    return (
        <span className="inline-flex items-center font-mono text-lg">
            <span className="text-2xl leading-none text-neutral-400">[</span>
            <span className="inline-flex flex-col mx-1 leading-relaxed">
                {rows.map((row, i) => (
                    <span key={i} className="whitespace-nowrap">
                        {row.join("  ")}
                    </span>
                ))}
            </span>
            <span className="text-2xl leading-none text-neutral-400">]</span>
        </span>
    );
}

function MatrixVec({ rows }) {
    return (
        <span className="inline-flex items-center font-mono text-lg">
            <span className="text-2xl leading-none text-neutral-400">[</span>
            <span className="inline-flex flex-col mx-1 leading-relaxed">
                {rows.map((row, i) => (
                    <span key={i} className="whitespace-nowrap">
                        {row}
                    </span>
                ))}
            </span>
            <span className="text-2xl leading-none text-neutral-400">]</span>
        </span>
    );
}

function firstPixel(data) {
    if (!data || data.data.length < 4) return null;
    return {
        r: data.data[0],
        g: data.data[1],
        b: data.data[2],
        a: data.data[3],
    };
}

function clamp(v) {
    return Math.max(0, Math.min(255, Math.round(v)));
}

function GrayscaleBody({ pixel }) {
    const L = 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b;
    const Lr = Math.round(L);

    return (
        <div className="space-y-3">
            <p className="text-sm text-neutral-300">
                Each RGB pixel is reduced to a single luminance value:
            </p>
            <div className="flex items-center justify-center gap-2 text-lg font-mono bg-neutral-900 rounded p-4">
                <span className="text-sky-300">L</span>
                <span className="text-neutral-400">=</span>
                <span className="text-red-400">0.299</span>
                <span className="text-neutral-300">·</span>
                <span className="text-red-400">{pixel.r}</span>
                <span className="text-neutral-400">+</span>
                <span className="text-green-400">0.587</span>
                <span className="text-neutral-300">·</span>
                <span className="text-green-400">{pixel.g}</span>
                <span className="text-neutral-400">+</span>
                <span className="text-blue-400">0.114</span>
                <span className="text-neutral-300">·</span>
                <span className="text-blue-400">{pixel.b}</span>
            </div>
            <div className="text-center text-sm font-mono bg-neutral-900 rounded p-3">
                <span className="text-neutral-400">= </span>
                <span className="text-neutral-300">
                    {(0.299 * pixel.r).toFixed(1)}
                </span>
                <span className="text-neutral-500"> + </span>
                <span className="text-neutral-300">
                    {(0.587 * pixel.g).toFixed(1)}
                </span>
                <span className="text-neutral-500"> + </span>
                <span className="text-neutral-300">
                    {(0.114 * pixel.b).toFixed(1)}
                </span>
                <span className="text-neutral-400"> = </span>
                <span className="text-sky-300 font-bold">{Lr}</span>
            </div>
            <p className="text-xs text-neutral-500">
                Original: R={pixel.r}, G={pixel.g}, B={pixel.b} → All channels
                set to <span className="text-sky-300">{Lr}</span>
            </p>
        </div>
    );
}

function BrightnessBody({ pixel, delta }) {
    const R2 = clamp(pixel.r + delta);
    const G2 = clamp(pixel.g + delta);
    const B2 = clamp(pixel.b + delta);

    return (
        <div className="space-y-3">
            <p className="text-sm text-neutral-300">
                A constant <em className="text-yellow-300">β = {delta}</em> is
                added to each channel, clamped to 0–255:
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm font-mono bg-neutral-900 rounded p-4">
                <div className="text-center">
                    <div className="text-red-400 text-xs mb-1">Red</div>
                    <div className="text-neutral-500">
                        {pixel.r} + ({delta}) = {R2}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-green-400 text-xs mb-1">Green</div>
                    <div className="text-neutral-500">
                        {pixel.g} + ({delta}) = {G2}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-blue-400 text-xs mb-1">Blue</div>
                    <div className="text-neutral-500">
                        {pixel.b} + ({delta}) = {B2}
                    </div>
                </div>
            </div>
            <p className="text-xs text-neutral-500">
                Before: ({pixel.r}, {pixel.g}, {pixel.b}) → After: ({R2}, {G2},{" "}
                {B2})
            </p>
        </div>
    );
}

function InvertBody({ pixel }) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-neutral-300">
                Each channel is subtracted from 255:
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm font-mono bg-neutral-900 rounded p-4">
                <div className="text-center">
                    <div className="text-red-400 text-xs mb-1">Red</div>
                    <div className="text-neutral-500">
                        255 − {pixel.r} = {255 - pixel.r}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-green-400 text-xs mb-1">Green</div>
                    <div className="text-neutral-500">
                        255 − {pixel.g} = {255 - pixel.g}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-blue-400 text-xs mb-1">Blue</div>
                    <div className="text-neutral-500">
                        255 − {pixel.b} = {255 - pixel.b}
                    </div>
                </div>
            </div>
            <p className="text-xs text-neutral-500">
                Before: ({pixel.r}, {pixel.g}, {pixel.b}) → After: (
                {255 - pixel.r}, {255 - pixel.g}, {255 - pixel.b})
            </p>
        </div>
    );
}

function ScaleBody({ scalePct, oW, oH }) {
    const s = scalePct / 100;
    const dW = Math.round(oW * s);
    const dH = Math.round(oH * s);

    return (
        <div className="space-y-3">
            <p className="text-sm text-neutral-300">
                Each pixel coordinate is multiplied by the scale factor{" "}
                <em className="text-yellow-300">{s}×</em>:
            </p>
            <div className="flex items-center justify-center gap-3 text-lg font-mono bg-neutral-900 rounded p-4">
                <MatrixVec rows={["x'", "y'"]} />
                <span className="text-neutral-400">=</span>
                <Matrix2x2
                    rows={[
                        [`${s}`, "0"],
                        ["0", `${s}`],
                    ]}
                />
                <span className="text-neutral-300">·</span>
                <MatrixVec rows={["x", "y"]} />
            </div>
            <div className="text-center text-sm font-mono bg-neutral-900 rounded p-3">
                <span className="text-neutral-500">{oW}×{oH}</span>
                <span className="text-neutral-400"> → </span>
                <span className="text-sky-300 font-bold">
                    {dW}×{dH}
                </span>
            </div>
            <p className="text-xs text-neutral-500">
                Each source pixel maps to a {s >= 1 ? `${Math.round(s)}×${Math.round(s)}` : `${(1/s).toFixed(1)}×${(1/s).toFixed(1)}`}{" "}
                block in the output.
            </p>
        </div>
    );
}

function RotateBody({ angleDeg, oW, oH }) {
    const rad = (angleDeg * Math.PI) / 180;
    const cosVal = Math.cos(rad);
    const sinVal = Math.sin(rad);
    const cosS = cosVal.toFixed(4);
    const sinS = sinVal.toFixed(4);
    const cosAbs = Math.abs(cosVal);
    const sinAbs = Math.abs(sinVal);
    const dW = Math.max(1, Math.round(oW * cosAbs + oH * sinAbs));
    const dH = Math.max(1, Math.round(oW * sinAbs + oH * cosAbs));

    return (
        <div className="space-y-3">
            <p className="text-sm text-neutral-300">
                Each pixel is rotated by{" "}
                <em className="text-yellow-300">{angleDeg}°</em> about the
                origin:
            </p>
            <div className="flex items-center justify-center gap-3 text-lg font-mono bg-neutral-900 rounded p-4">
                <MatrixVec rows={["x'", "y'"]} />
                <span className="text-neutral-400">=</span>
                <Matrix2x2
                    rows={[
                        [`cos ${angleDeg}°`, `-sin ${angleDeg}°`],
                        [`sin ${angleDeg}°`, `cos ${angleDeg}°`],
                    ]}
                />
                <span className="text-neutral-300">·</span>
                <MatrixVec rows={["x", "y"]} />
            </div>
            <div className="text-center text-sm font-mono bg-neutral-900 rounded p-3">
                <span className="text-neutral-300">
                    cos({angleDeg}°) = {cosS}
                </span>
                <span className="text-neutral-500"> &nbsp;|&nbsp; </span>
                <span className="text-neutral-300">
                    sin({angleDeg}°) = {sinS}
                </span>
            </div>
            <div className="text-center text-sm font-mono bg-neutral-900 rounded p-3">
                <span className="text-neutral-500">{oW}×{oH}</span>
                <span className="text-neutral-400"> → </span>
                <span className="text-sky-300 font-bold">
                    {dW}×{dH}
                </span>
                <span className="text-neutral-500"> (rotated bounds)</span>
            </div>
            <p className="text-xs text-neutral-500">
                The rotation matrix is applied to every pixel coordinate.
            </p>
        </div>
    );
}

function NoPixelBody() {
    return (
        <p className="text-sm text-neutral-500 italic">
            Hover over a region on the image to see real pixel math.
        </p>
    );
}

export default function MathVisualizer({
    activeTab,
    originalPixels,
    processedPixels,
    params,
    originalWidth,
    originalHeight,
}) {
    const pixel = useMemo(() => {
        if (activeTab === "scale" || activeTab === "rotate")
            return { r: 0, g: 0, b: 0, a: 255 };
        return firstPixel(originalPixels) || firstPixel(processedPixels);
    }, [activeTab, originalPixels, processedPixels]);

    const title = useMemo(() => {
        switch (activeTab) {
            case "grayscale":
                return "Grayscale — Luminance Weighting";
            case "brightness":
                return "Brightness Adjustment";
            case "invert":
                return "Color Inversion";
            case "scale":
                return "Scaling — Affine Transform";
            case "rotate":
                return "Rotation — 2D Rotation Matrix";
            default:
                return "Operation Math";
        }
    }, [activeTab]);

    const body = useMemo(() => {
        if (!activeTab) {
            return (
                <p className="text-sm text-neutral-500 italic">
                    Select an operation in the Image Processor below to see its
                    math applied to real pixel data.
                </p>
            );
        }

        if (!pixel && activeTab !== "scale" && activeTab !== "rotate") {
            return <NoPixelBody />;
        }

        switch (activeTab) {
            case "grayscale":
                return <GrayscaleBody pixel={pixel} />;
            case "brightness":
                return (
                    <BrightnessBody
                        pixel={pixel}
                        delta={Math.round(params.brightness * 2.55)}
                    />
                );
            case "invert":
                return <InvertBody pixel={pixel} />;
            case "scale":
                return (
                    <ScaleBody
                        scalePct={params.scale}
                        oW={originalWidth}
                        oH={originalHeight}
                    />
                );
            case "rotate":
                return (
                    <RotateBody
                        angleDeg={params.rotate}
                        oW={originalWidth}
                        oH={originalHeight}
                    />
                );
            default:
                return null;
        }
    }, [activeTab, pixel, params, originalWidth, originalHeight]);

    return (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4 h-full">
            <h3 className="text-lg font-semibold text-sky-400 mb-3">
                {title}
            </h3>
            {body}
        </div>
    );
}
