import { useEffect, useState, useRef } from "react";

const SELECTOR_SIZE = 64; // 64 pixels

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
    onRegionChange: (coords: RegionCoords) => void;
}

/**
 * RegionSelector renders the source image on a canvas and overlays a
 * fixed-size square that follows the pointer, reporting its coordinates
 * (relative to the canvas) via onRegionChange.
 */
export default function RegionSelector({ imageUrl, onRegionChange }: RegionSelectorProps) {
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

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();

        let localX = e.clientX - rect.left - SELECTOR_SIZE / 2;
        let localY = e.clientY - rect.top - SELECTOR_SIZE / 2;

        localX = Math.max(0, Math.min(localX, rect.width - SELECTOR_SIZE));
        localY = Math.max(0, Math.min(localY, rect.height - SELECTOR_SIZE));

        const newCoords: RegionCoords = {
            x: Math.round(localX),
            y: Math.round(localY),
            w: SELECTOR_SIZE,
            h: SELECTOR_SIZE,
        };

        setCoords(newCoords);

        // change in region = change in pixel grid
        if (canvasRef.current) {
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            onRegionChange?.({
                x: Math.round(localX * scaleX),
                y: Math.round(localY * scaleY),
                w: Math.round(SELECTOR_SIZE * scaleX),
                h: Math.round(SELECTOR_SIZE * scaleY),
            });
        }    
    };

    // AI Declaration: Used AI to figure out what style classes are needed. Upon experimentation, tailwindcss
    // specifically does not yield the desire result, hence the need for manual style properties to override
    // any CSS styling and ensure the region appears on top of the image correctly
    return (
        <div
            id="image-container-frame"
            style={{
                position: "relative",
                width: "100%",
                maxWidth: "400px",
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
                width={400}
                height={400}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    backgroundColor: "#0a0a0a",
                    borderRadius: "8px",
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