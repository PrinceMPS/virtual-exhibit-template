import type { DecodedImage, ImageLoadError } from "../S04_Group8_lib/types";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
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
    hasImage?: boolean;
}

export default function InputImage({
    onImageLoad,
    onError,
    maxFileSizeMB = 10,
    acceptedTypes = ["image/png", "image/jpeg", "image/bmp", "image/webp"],
    hasImage = false,
}: InputImageProps) {
    const [isDecoding, setIsDecoding] = useState(false);
    const [localError, setLocalError] = useState<ImageLoadError | null>(null);
    const [showSamples, setShowSamples] = useState(false);

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

    const { getRootProps, getInputProps, open } = useDropzone({
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
        noClick: true,
    });

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

    const uploadLabel = isDecoding
        ? "Decoding…"
        : hasImage
        ? "Change Image"
        : "Upload Image";

    return (
        <div>
            <div
                {...getRootProps()}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                }}
            >
                <input {...getInputProps()} />

                <div style={{ display: "flex", gap: "16px" }}>
                    <button
                        type="button"
                        onClick={open}
                        disabled={isDecoding}
                        title="PNG, JPG/JPEG, BMP, HEIC"
                        style={{
                            padding: "12px 32px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#71C6FF",
                            color: "#292929",
                            fontSize: "16px",
                            fontWeight: 500,
                            cursor: isDecoding ? "not-allowed" : "pointer",
                            opacity: isDecoding ? 0.6 : 1,
                        }}
                    >
                        {uploadLabel}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowSamples(!showSamples)}
                        disabled={isDecoding}
                        style={{
                            padding: "12px 32px",
                            borderRadius: "8px",
                            border: "1px solid #ffffff",
                            backgroundColor: "#292929",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: 500,
                            cursor: isDecoding ? "not-allowed" : "pointer",
                            opacity: isDecoding ? 0.6 : 1,
                        }}
                    >
                        Pick Sample Photo
                    </button>
                </div>

                {showSamples && (
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {SAMPLE_IMAGES.map((sample) => (
                            <button
                                key={sample.id}
                                type="button"
                                onClick={() => handleSampleClick(sample)}
                                disabled={isDecoding}
                                title={sample.desc}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    border: "1px solid #555",
                                    backgroundColor: "#333",
                                    color: "#fff",
                                    fontSize: "14px",
                                    cursor: isDecoding
                                        ? "not-allowed"
                                        : "pointer",
                                    opacity: isDecoding ? 0.6 : 1,
                                }}
                            >
                                {sample.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {localError && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        borderRadius: "6px",
                        backgroundColor: "#fef2f2",
                        padding: "12px",
                        fontSize: "14px",
                        color: "#b91c1c",
                        marginTop: "12px",
                    }}
                >
                    <span>{localError.mssg}</span>
                </div>
            )}
        </div>
    );
}
