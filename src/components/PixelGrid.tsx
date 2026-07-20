import { useRef, useState, useEffect, useCallback } from "react";
import { type Pixel } from "../S04_Group8_lib/types";

interface PixelGridProps {
    pixelData: ImageData | null;
}

export default function PixelGrid({ pixelData }: PixelGridProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [hoveredPixel, setHoveredPixel] = useState<Pixel | null>(null);
    const DISPLAY_SIZE = 400;

    const gridWidth = pixelData?.width ?? 0;
    const gridHeight = pixelData?.height ?? 0;

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas || !pixelData || gridWidth === 0 || gridHeight === 0)
            return;

        const context = canvas?.getContext("2d");
        if (!context) {
            console.error("Canvas context could not  be created");
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);

        const cellWidth = canvas.width / gridWidth;
        const cellHeight = canvas.height / gridHeight;

        const data = pixelData.data;

        //this might have to be a height then width loop instead
        for (let i = 0; i < gridWidth; i++) {
            for (let j = 0; j < gridHeight; j++) {
                const idx = (j * gridWidth + i) * 4;
                context.fillStyle = `rgba(${data[idx]}, ${data[idx + 1]}, ${data[idx + 2]}, ${data[idx + 3] / 255})`;
                context.fillRect(
                    i * cellWidth,
                    j * cellHeight,
                    cellWidth + 0.5,
                    cellHeight + 0.5,
                );
            }
        }
    }, [pixelData, gridWidth, gridHeight]);
    //rerender if any of the variables above change

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLCanvasElement>) => {
            //check
            if (!pixelData || gridWidth === 0 || gridHeight === 0) return;

            const rect = e.currentTarget.getBoundingClientRect();

            const localX = e.clientX - rect.left;
            const localY = e.clientY - rect.top;
            const cellX = Math.floor((localX / rect.width) * gridWidth);
            const cellY = Math.floor((localY / rect.height) * gridHeight);

            //check
            if (
                cellX < 0 ||
                cellX >= gridWidth ||
                cellY < 0 ||
                cellY >= gridHeight
            ) {
                setHoveredPixel(null);
                return;
            }

            const index = (cellY * gridWidth + cellX) * 4; //DONT REMOVE THIS 4
            const data = pixelData.data;
            const pixel = {
                x: cellX,
                y: cellY,
                r: data[index],
                g: data[index + 1],
                b: data[index + 2],
                a: data[index + 3],
            };
            setHoveredPixel(pixel);
        },
        [pixelData, gridWidth, gridHeight],
    );
    //rerender if any of the variables above change

    function toHex(red: number, green: number, blue: number): string {
        return (
            "#" +
            [red, green, blue]
                .map((c) => c.toString(16).padStart(2, "0"))
                .join("")
                .toUpperCase()
        );
    }

    return (
        <div className="flex flex-col gap-2 items-center">
            <canvas
                ref={canvasRef}
                width={DISPLAY_SIZE}
                height={DISPLAY_SIZE}
                style={{
                    width: "100%",
                    maxWidth: `${DISPLAY_SIZE}px`,
                    aspectRatio: "1 / 1",
                    display: "block",
                    backgroundColor: "#0a0a0a",
                    cursor: "pointer",
                }}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => setHoveredPixel(null)}
            />

            <div className="w-full text-sm text-center text-neutral-300 font-mono min-h-[2rem] justify-center flex items-center gap-4">
                {hoveredPixel ? (
                    <>
                        <span
                            className="inline-block w-6 h-6 rounded border border-neutral-600"
                            style={{
                                backgroundColor: `rgba(${hoveredPixel.r}, ${hoveredPixel.g}, ${hoveredPixel.b}, ${hoveredPixel.a / 255})`,
                            }}
                        />
                        <span>
                            ({hoveredPixel.x}, {hoveredPixel.y})
                        </span>
                        <span>
                            RGB({hoveredPixel.r}, {hoveredPixel.g},{" "}
                            {hoveredPixel.b})
                        </span>
                        <span>
                            {toHex(
                                hoveredPixel.r,
                                hoveredPixel.g,
                                hoveredPixel.b,
                            )}
                        </span>
                    </>
                ) : (
                    <span className="text-neutral-500">
                        Hover over a pixel to inspect it
                    </span>
                )}
            </div>
        </div>
    );
}
