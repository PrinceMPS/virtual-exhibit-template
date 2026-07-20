import { useEffect, useState, useRef, useCallback } from "react";

const SELECTOR_SIZE = 32; // 32 pixels
const CANVAS_SIZE = 400;

interface RegionCoords {
    x: number;
    y: number;
    w: number;
    h: number;
}

const DEFAULT_REGION: RegionCoords = {
    x: 0,
    y: 0,
    w: SELECTOR_SIZE,
    h: SELECTOR_SIZE,
};

interface RegionSelectorProps {
    imageUrl: string;
    onPixelsChange: (data: ImageData | null) => void;
}

/**
 * RegionSelector renders the source image on a canvas and overlays a
 * fixed-size square that follows the pointer, reporting its coordinates
 *
 */
export default function RegionSelector({
    imageUrl,
    onPixelsChange,
}: RegionSelectorProps) {
    const [coords, setCoords] = useState<RegionCoords>(DEFAULT_REGION);
    const [isVisible, setIsVisible] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !imageUrl) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let cancelled = false;
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            if (cancelled) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        img.src = imageUrl;

        return () => {
            cancelled = true;
        };
    }, [imageUrl]);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const scale = canvas.width / rect.width;

            let localX = (e.clientX - rect.left) * scale - SELECTOR_SIZE / 2;
            let localY = (e.clientY - rect.top) * scale - SELECTOR_SIZE / 2;

            localX = Math.round(
                Math.max(0, Math.min(localX, canvas.width - SELECTOR_SIZE)),
            );
            localY = Math.round(
                Math.max(0, Math.min(localY, canvas.height - SELECTOR_SIZE)),
            );

            const selector_to_scale = Math.round(SELECTOR_SIZE / scale);
            const newCoords: RegionCoords = {
                x: Math.round(localX / scale),
                y: Math.round(localY / scale),
                w: selector_to_scale,
                h: selector_to_scale,
            };

            setCoords(newCoords);

            // change in region = change in pixel grid
            if (canvasRef.current) {
                const pixels =
                    canvasRef.current
                        .getContext("2d")
                        ?.getImageData(
                            localX,
                            localY,
                            SELECTOR_SIZE,
                            SELECTOR_SIZE,
                        ) || null;
                onPixelsChange(pixels);
            }
        },
        [onPixelsChange],
    );

    // AI Declaration: Used AI to figure out what style classes are needed. Upon experimentation, tailwindcss
    // specifically does not yield the desire result, hence the need for manual style properties to override
    // any CSS styling and ensure the region appears on top of the image correctly
    return (
        <div
            id="image-container-frame"
            style={{
                position: "relative",
                width: "100%",
                maxWidth: `${CANVAS_SIZE}px`,
                aspectRatio: "1 / 1",
                userSelect: "none",
                cursor: "none",
                margin: "0 auto",
                zIndex: 50,
            }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsVisible(true)}
            onPointerLeave={() => setIsVisible(false)}
        >
            <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    backgroundColor: "#0a0a0a",
                }}
            />

            {isVisible && (
                <div
                    id="square-selector"
                    style={{
                        left: `${coords.x}px`,
                        top: `${coords.y}px`,
                        width: `${coords.w}px`,
                        height: `${coords.h}px`,
                        position: "absolute",
                        zIndex: 99,
                        pointerEvents: "none",
                        border: "2px solid #ffffff",
                        boxShadow: "0 0 0 1px #000000, inset 0 0 0 1px #000000",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                    }}
                />
            )}
        </div>
    );
}
