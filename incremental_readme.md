# Inside a Digital Image: How Computers Store and Transform Visual Data

> Incremental README. This document builds on the existing proposal; lists the progress and updates by date and contributor.

---

## Original Proposal

See Proposal: [Original Proposal](./README.md)

---

## Audit Log

### 06/22/2026 – Research/Readings

**Contributor/s**

- Sy, Prince Matthew

**Tasks Accomplished**

- Researched how different image file types are stored in memory

**Things Learned**

- How PNG, BMP, HEIC image files are stored

**Challenges**

- How JPG files are stored, as they are considerably different from the other image types

**Related Files/Links**

- [How BMP Files are Stored](https://www.bbc.co.uk/bitesize/guides/zphqgdm/revision/4)
- [How PNG Files are Stored](https://www.w3.org/TR/PNG-DataRep.html)
- [How HEIC Files are Stored](https://youtu.be/eS4I4QJEOWU?si=DOojXBYU3Ams5k3C)

### 06/30/2026 – Initial Set Up

**Contributor/s**

- Sia, Justin Michael

**Tasks Accomplished**

- installed relevent dependencies

### 07/03/2026 – Image Input + Continuation of Set Up

**Contributor/s**

- Chu, Avery Simone

**Tasks Accomplished**

- Removed unnecessary placeholder files
- Created types.js helper – stores user-defined data types
- Created initial index.mdx page –
- Created initial ImageInput.jsx component – For image file uploading
- Created initial imageLoader.js helper – For image processing and storage
- Created initial App.jsx component – The actual

**Challenges**

- Learning curve in understanding how Astro works, which was manageable due to previous experience with React

**Design Decisions**

- Adhered to the original

**Related Files/Links**

### 07/04/2026 – SplitScreen + RegionSelector

**Contributor/s**

- Saguin, VL Kirsten Camille "Kei"

**Tasks Accomplished**

- Created initial SplitScreen.jsx
- Created initial RegionSelector.jsx
    > Code to be adjusted based on future revisions.

**Things Learned**

- Dealing with movement (or changes in pixel coordinate positions) means constant updates with current values and computations

**Challenges**

- A lot of the things here are dependent on each other, which poses scheduling challenges

**Design Decisions**

- Followed the initial preview snapshot and simplified where possible to focus on necessary features

### 07/07/2026 – Home Page Layout

**Contributor/s**

- Sia, Justin Michael

**Tasks Accomplished**

- Accomplished basic layout and styling of Home Page

**Challenges**

- A bit of a learning curve using Astro, but it's manageable since it's similar to React
- Tight Schedule/Schedule Conflicts

**Design Decisions**

- Focusing on simple, achievable, functional layouts but leaving room for improvement later.

### 07/19/2026 – Bug fixes + Conversion to .tsx + Downloading of additional dependencies

**Contributor/s**

- Sia, Justin Michael

**Tasks Accomplished**

- Conversion of all jsx components to tsx
- Updated incorrect logic in the code, particularly non-matching return types after the tsx conversion
- Downloading dependencies needed for additional functionality / styling

**Things Learned**

- Tsx simplifies web development more because you spend less time troubleshooting. Therefore use .tsx files from the start next time.

---

### 07/20/2026 – Home Page + Interactible Page Styling + Zoomed-in Image Pixel Grid

**Contributor/s**

- Chu, Avery Simone
- Saguin, VL Kirsten Camille "Kei"
- Sia, Justin Michael

**Tasks Accomplished**

- Updated styling to match revised snapshot
- Created PixelGrid component which shows a 32x32 region of pixels from the image.
  You can hover over a pixel to display its coordinates and color values.

---

### 07/21/2026 - Image Data Modelling + Math Visualization

**Contributor/s**

- Sy, Prince Matthew 

**Tasks Accomplished**

- Created ImageProcessing logic that applies different filters to the image
- Created MathVisualizer to dynamically show the math that is responsible for the change in the image
- Added extra feature in ImageProcessing (color filters)

**AHA! moment**
- while making the invert feature for the ImageProcessing, I realized na adding color filters would not be that much more difficult as the math is similar, just needed to tweak some things here and there to make it appropriate

## Milestones to be Accomplished by Final Submission

- PixelGrid.jsx – for the enlarged pixel grid when a region is selected
- PixelInspector.jsx – will display the coordinates, RGB, HSB/HSL, Alpha, Hex, Binary, approximate memory layout
- PipelineVisualizer.jsx – flowchart visualizer for storage
- FormatModule.jsx – comparison cards for JPG/JPEG, PNG, BMP, HEIC
- MemoryVisualization.jsx - compact hex/binary table showing raw pixel data in RAM
- Educational Text Content on each page

---

## Use of Generative AI/LLM

- DeepSeek was used to help identify and delegate tasks into relevant milestone divisions.
- Claude was used to elaborate on what certain functions related to an HTML Canvas Element did. It also provided knowledge how RGB-to-HSL conversion is performed but did not contribute to the programmed function.
