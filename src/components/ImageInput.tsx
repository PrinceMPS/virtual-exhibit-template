import type { DecodedImage, ImageLoadError } from "../S04_Group8_lib/types";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, ImageIcon, AlertCircle } from "lucide-react";
import {
    loadImage,
    loadSample,
    SAMPLE_IMAGES,
} from "../S04_Group8_lib/imageLoader";

interface InputImageProps {
    onImageLoad: (image: DecodedImage) => void;
    onError?: (error: ImageLoadError) => void;
    maxFileSizeMB?: number;
    acceptedTypes?: string[];
}

// A React component that allows users to upload an image file or select a sample image. It handles image decoding and error reporting.
export default function InputImage({
    onImageLoad,
    onError,
    maxFileSizeMB = 10,
    acceptedTypes = ["image/png", "image/jpeg", "image/bmp", "image/webp"],
}: InputImageProps) {
    const [isDecoding, setIsDecoding] = useState(false);
    const [localError, setLocalError] = useState<ImageLoadError | null>(null);

    const handleError = useCallback(
        (err: ImageLoadError) => {
            setLocalError(err);
            onError?.(err);
        },
        [onError]
    );

    const onDrop = useCallback(
        async (acceptedFiles: File[], rejectedFiles: any[]) => {
            setLocalError(null);

            if (rejectedFiles?.length) {
                handleError({
                    code: "unsupported_type",
                    mssg: `"${rejectedFiles[0].file.name}" isn't a supported image type.`,
                });
                return;
            }

            const file = acceptedFiles[0];
            if (!file) return;

            setIsDecoding(true);
            try {
                const image = await loadImage(file, {
                    maxSizeMB: maxFileSizeMB,
                    acceptedTypes,
                });
                onImageLoad(image);
            } catch (err) {
                handleError(err as ImageLoadError);
            } finally {
                setIsDecoding(false);
            }
        },
        [maxFileSizeMB, acceptedTypes, onImageLoad, handleError]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: Object.fromEntries(
            (
                acceptedTypes ?? [
                    "image/png",
                    "image/jpeg",
                    "image/bmp",
                    "image/webp",
                ]
            ).map((t) => [t, []])
        ),
    });

    /** @param {typeof SAMPLE_IMAGES[number]} sample */
    async function handleSampleClick(sample: (typeof SAMPLE_IMAGES)[number]) {
        setLocalError(null);
        setIsDecoding(true);
        try {
            const image = await loadSample(sample);
            onImageLoad(image);
        } catch (err) {
            handleError(err as ImageLoadError);
        } finally {
            setIsDecoding(false);
        }
    }

    return (
        <div className="w-[70%] h-50 gap-10 max-w-xl mx-auto space-y-4 flex flex-row">
            <div
                {...getRootProps()}
                className={
                    "h-50 w-70 flex flex-col items-center justify-center gap-2 rounded-lg border-3 border-blue-400 border-dashed p-8 text-center cursor-pointer group transition-colors duration-500 hover:bg-white isDragActive ? 'bg-blue-50' : ''"
                }
            >
                <input {...getInputProps()} />
                <UploadCloud
                    className="w-8 h-8 text-gray-400 group-hover:text-gray-700 transition-colors duration-500"
                    aria-hidden="true"
                />
                <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-500">
                    {isDecoding
                        ? "Decoding…"
                        : isDragActive
                        ? "Drop the image here"
                        : "Drag an image here, or click to browse"}
                </p>
                <p className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-500">
                    PNG, JPG/JPEG, BMP, WEBP — up to {maxFileSizeMB}MB
                </p>
            </div>

            {localError && (
                <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle
                        className="w-4 h-4 mt-0.5 shrink-0"
                        aria-hidden="true"
                    />
                    <span>{localError.mssg}</span>
                </div>
            )}

            <div
                className="w-65 flex flex-col items-center justify-center gap-2 rounded-lg border-3 border-blue-400 border-dashed p-8 text-center cursor-pointer
                    group transition-colors duration-500 hover:bg-white"
            >
                <p className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-600">
                    <ImageIcon className="w-4 h-4" aria-hidden="true" />
                    Or try a sample photo
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SAMPLE_IMAGES.map((sample) => (
                        <button
                            key={sample.id}
                            type="button"
                            onClick={() => handleSampleClick(sample)}
                            disabled={isDecoding}
                            title={sample.desc}
                            className="rounded-md border border-gray-200 p-2 text-xs text-gray-600 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            {sample.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
