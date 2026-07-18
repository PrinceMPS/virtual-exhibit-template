# Inside a Digital Image: How Computers Store and Transform Visual Data

> Incremental README. This document builds on the existing proposal; lists the progress and updates by date and contributor.

---

## Original Proposal

See Proposal: [Original Proposal](./README.md)

---

## Audit Log

### 06/22/2026 – Research/Readings

**Contributor/s**

-   Sy, Prince Matthew

**Tasks Accomplished**

-   Researched how different image file types are stored in memory

**Things Learned**

-   How PNG, BMP, HEIC image files are stored

**Challenges**

-   How JPG files are stored, as they are considerably different from the other image types

**Related Files/Links**

-   [How BMP Files are Stored](https://www.bbc.co.uk/bitesize/guides/zphqgdm/revision/4)
-   [How PNG Files are Stored](https://www.w3.org/TR/PNG-DataRep.html)
-   [How HEIC Files are Stored](https://youtu.be/eS4I4QJEOWU?si=DOojXBYU3Ams5k3C)

### 06/30/2026 – Initial Set Up

**Contributor/s**

-   Sia, Justin Michael

**Tasks Accomplished**

-   installed relevent dependencies

### 07/03/2026 – Image Input + Continuation of Set Up

**Contributor/s**

-   Chu, Avery Simone

**Tasks Accomplished**

-   Removed unnecessary placeholder files
-   Created types.js helper – stores user-defined data types
-   Created initial index.mdx page –
-   Created initial ImageInput.jsx component – For image file uploading
-   Created initial imageLoader.js helper – For image processing and storage
-   Created initial App.jsx component – The actual

**Challenges**

-   Learning curve in understanding how Astro works, which was manageable due to previous experience with React

**Design Decisions**

-   Adhered to the original

**Related Files/Links**

### 07/04/2026 – SplitScreen + RegionSelector

**Contributor/s**

-   Saguin, VL Kirsten Camille "Kei"

**Tasks Accomplished**

-   Created initial SplitScreen.jsx
-   Created initial RegionSelector.jsx
    > Code to be adjusted based on future revisions.

**Things Learned**

-   Dealing with movement (or changes in pixel coordinate positions) means constant updates with current values and computations

**Challenges**

-   A lot of the things here are dependent on each other, which poses scheduling challenges

**Design Decisions**

-   Followed the initial preview snapshot and simplified where possible to focus on necessary features

### 07/07/2026 – Home Page Layout

**Contributor/s**

-   Sia, Justin Michael

**Tasks Accomplished**

-   Accomplished basic layout and styling of Home Page

**Challenges**

-   A bit of a learning curve using Astro, but it's manageable since it's similar to React
-   Tight Schedule/Schedule Conflicts

**Design Decisions**

-   Focusing on simple, achievable, functional layouts but leaving room for improvement later.

---

## Milestones to be Accomplished by Final Submission

-   PixelGrid.jsx – for the enlarged pixel grid when a region is selected
-   PixelInspector.jsx – will display the coordinates, RGB, HSB/HSL, Alpha, Hex, Binary, approximate memory layout
-   imageProcessing.js – handles transform functions: grayscale, rotation, brightness
-   ImageProcessing.jsx – controls for each operation
-   MathVisualizer.jsx – renders transform function formulas
-   PipelineVisualizer.jsx – flowchart visualizer for storage
-   FormatModule.jsx – comparison cards for JPG/JPEG, PNG, BMP, HEIC
-   MemoryVisualization.jsx - compact hex/binary table showing raw pixel data in RAM
-   Educational Text Content on each page

---

## Use of Generative AI/LLM

DeepSeek was used to help identify and delegate tasks into relevant milestone divisions.

---

## Deployment

See deployment link: [Virtual Exhibit](https://csarch-2-virtual-exhibit-theta.vercel.app/?fbclid=IwY2xjawS6AS5leHRuA2FlbQIxMABicmlkETFMZHV2bVNnU3hCVmk4MXMyc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHmsULAcmh8ULT2DKQy42Bmo1ITYl_qc6f1dc4CwjOE_RzGtf4JLyTnPphdlH_aem_natUjULwv7nzu2Tcidmw8g)
