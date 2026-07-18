import React, { useState } from 'react';
import RegionSelector from './RegionSelector';
import ImageInput from './ImageInput';

/**
 * @param {{
 *   onRegionChange?: (coords: any) => void,
 * }} props
 */


export default function SplitScreen({ onRegionChange }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleRegionChange = (coords) => {
    console.log("Current tracking matrix region:", coords);
    // TODO: implement pixel grid here
  };

  return (
    <div className="p-6 bg-neutral-900 text-white min-h-screen min-w-screen flex flex-col gap-6">
      <div className="flex gap-4">
        <button
          type="button"
          className="px-4 py-2 bg-sky-500 rounded font-medium"
          onClick={() => setSelectedImage(null)}
        >
          Change Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative aspect-square w-full overflow-hidden">
          {selectedImage ? (
            <RegionSelector
              imageUrl={selectedImage.url}
              onRegionChange={onRegionChange ?? handleRegionChange}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-400">
              <ImageInput onImageLoad={setSelectedImage} />
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2 bg-neutral-900/90 px-3 py-1.5 rounded-full border border-neutral-700 pointer-events-auto select-none">
            <button type="button" title="Rotate Clockwise" className="p-1.5 text-neutral-300">↻</button>
            <button type="button" title="Zoom Out" className="p-1.5 text-neutral-300">−</button>
            <button type="button" title="Zoom In" className="p-1.5 text-neutral-300">+</button>
          </div>
        </div>

        <div id="pixel-grid-panel">
          {/*PUT PIXEL GRID HERE*/}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-sky-400 mb-2">How it works in math</h3>
          <p className="text-neutral-400 text-sm">Explanation text here</p>
          <span>[Math Matrix Visual Placeholder]</span>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-sky-400 mb-2">How it works in memory</h3>
          <p className="text-neutral-400 text-sm">Explanation text here</p>
          <span>[Memory Layout Visual Placeholder]</span>
        </div>
      </div>
    </div>
  );
}