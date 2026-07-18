// Build RegionSelector.jsx — draggable selection rectangle overlay on the image canvas, emits {x, y, w, h} for PixelGrid

import React from 'react';

const SELECTOR_SIZE = 64; // 64 pixels
const RegionCoordinates = {
    x: 0,
    y: 0,
    w: SELECTOR_SIZE,
    h: SELECTOR_SIZE
}

/* 
* RegionSelector holds the image so that the coordinates getting returned are accurate
*
*/

export default function RegionSelector({ imageUrl, onRegionChange }) {
    const [coords, setCoords] = useState(RegionCoordinates);
    const [isVisible, setIsVisible] = useState(false);

    const canvasRef = useRef(null);

    // Native Canvas API rendering engine loops whenever props modify downstream
    useEffect(() => {
        if (!canvasRef.current || !imageUrl) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // clear old frame history buffers
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // freeze coordinates tracking matrices
            ctx.save();

            // draw relative to its center point
            ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

            ctx.restore();
        };

        img.src = imageUrl;
    }, [imageUrl]);

    const handlePointerMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        let localX = e.clientX - rect.left - SELECTOR_SIZE / 2;
        let localY = e.clientY - rect.top - SELECTOR_SIZE / 2;

        localX = Math.max(0, Math.min(localX, rect.width - SELECTOR_SIZE))
        localY = Math.max(0, Math.min(localY, rect.height - SELECTOR_SIZE))

        const NewCoords = {
            x: Math.round(localX),
            y: Math.round(localY),
            w: SELECTOR_SIZE,
            h: SELECTOR_SIZE
        };

        setCoords(NewCoords);

        // change in region = change in pixelgrid
        if (onRegionChange) {
            onRegionChange(updatedCoordinates)
        }
    }
    return (
        <div
            id="image-container-frame"
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsVisible(true)}
            onPointerLeave={() => setIsVisible(false)}
        >
            {/* <div id="image-placeholder" className="w-full h-full bg-neutral-900">
                 contains canvas from image loading
            </div> */}
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full h-full block bg-neutral-950"
            >

            </canvas>

            {isVisible && (
                <div
                    id="square-selector"
                    className="absolute border-2 border-white pointer-events-none"
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
