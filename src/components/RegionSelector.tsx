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
        onRegionChange?.(newCoords);
    };

    return (
        <div
            id="image-container-frame"
            className="z-50 npx relative w-full h-full"
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsVisible(true)}
            onPointerLeave={() => setIsVisible(false)}
        >
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full h-full block bg-neutral-950"
            />

            {isVisible && (
                <div
                    id="square-selector"
                    className="absolute z-10 border-2 border-white pointer-events-none"
                    style={{
                        left: `${coords.x}px`,
                        top: `${coords.y}px`,
                        width: `${coords.w}px`,
                        height: `${coords.h}px`,
                    }}
                />
            )}
        </div>
    );
}