# Snake Back Animation

A lightweight, zero-dependency WebGL animation of a snake's back crawling straight upwards in an infinite, mathematically seamless loop.

---

## 🎯 Project Goals

1. **Realistic Keeled Scales**: Tactile 3D relief featuring overlapping rhomboid shingles with a raised central dorsal keel (ridge) and keratin sheen.
2. **Cylindrical 3D Curvature & Lighting**: Brightest along the center spine with soft light falloff toward the edges to create a rounded cylindrical body.
3. **Mathematically Seamless Upward Crawl**: A steady vertical translation that loops infinitely without seams, jumps, or pops.
4. **Decent Web & Mobile Performance**: High frame rates (60–120 FPS) achieved via an optimized fragment shader with minimal GPU overhead and no heavy raymarching.
5. **Modern Mobile Fullscreen**: Zero scrollbars, no bouncy overscroll, full `100dvh` viewport coverage, and tap/click anywhere to toggle browser full-screen mode.

---

## 📐 Architecture & Key Design Decisions

During the design phase, the following core decisions were established:

- **Rendering Engine**: Pure WebGL2 with automatic WebGL1 fallback (`OES_standard_derivatives`) on a single fullscreen quad.
  - Zero external dependencies (no Three.js or heavy bundlers).
  - Instant load time and minimal battery consumption.
- **Scale Anatomy & Visual Style**: Eastern/Western Diamondback rattlesnake (*Crotalus*).
  - Shingled diamond grid: Cranial root tucks under; caudal tip overlaps over the scale behind it.
  - Analytic surface normal calculation using hardware screen-space derivatives (`dFdx`/`dFdy`).
  - Dorsal Diamondback chain markings: Deep espresso borders, pale ivory halos, and warm buff centers.
- **Motion & Periodicity**:
  - Pure rectilinear upward translation: $v = y_{\text{scaled}} - \text{speed} \times t$.
  - Periodic mathematical tiling: The staggered scale grid repeats every 2 rows; the dorsal diamond pattern repeats every 8 rows. Any state at row $v$ is identical to $v \pmod 8$.
- **Viewport & Aspect Ratio**:
  - The snake body spans 100% of the screen width in both portrait and landscape.
  - Scales scale proportionally with width, meaning landscape view naturally yields larger scales.
- **Interaction**:
  - Tap or click anywhere toggles the Fullscreen API.
  - Modern CSS (`height: 100dvh; min-height: 100svh; touch-action: none; overflow: hidden; position: fixed; inset: 0;`).

---

## 📁 Project Structure

```
.
├── index.html       # Entry HTML with mobile viewport-fit and meta tags
├── styles.css       # Fullscreen layout, 100dvh, zero-scrollbar styling
├── main.js          # WebGL dual-context setup, shaders, resize, and render loop
└── README.md        # Project documentation and developer notes
```

---

## 🚀 Running Locally

Start any static HTTP server from the project directory:

```bash
# Python
python3 -m http.server 8080

# Or Node.js
npx serve -l 8080
```

Open `http://localhost:8080` in any desktop or mobile browser.

---

## 📸 Headless Firefox Screenshot Trick (Linux & WebGL)

Taking headless screenshots of WebGL canvases in Linux (especially when Firefox is packaged via Snap) often results in completely black images or errors like `FEATURE_FAILURE_WEBGL_EXHAUSTED_DRIVERS` and `AllowWebgl2:false`.

### Why It Fails by Default
1. **Snap Sandboxing**: Snap packages run inside an AppArmor profile that isolates offscreen headless processes from GPU devices (`/dev/dri`) unless connected to an active display session.
2. **Missing Display Environment**: When executed in a headless terminal or background runner, `DISPLAY`, `WAYLAND_DISPLAY`, and `XDG_RUNTIME_DIR` are unset, causing Firefox to disable WebGL hardware acceleration.
3. **Canvas Buffer Compositing**: WebGL canvases default to `preserveDrawingBuffer: false`. In headless capture modes, the buffer can be cleared before the screenshot compositor takes the frame.

### The Solution

#### 1. Code Adjustments (`main.js`)
- Enable `preserveDrawingBuffer: true` when initializing the WebGL context:
  ```javascript
  const gl = canvas.getContext('webgl2', {
    preserveDrawingBuffer: true,
    // ...
  });
  ```
- Trigger an immediate synchronous `render()` pass upon initialization (do not wait only for `requestAnimationFrame`).
- Support an optional `?snap=1` query parameter that captures `canvas.toDataURL('image/png')` into an overlaid `<img>` element so the headless DOM compositor reliably reads the frame:
  ```javascript
  if (new URLSearchParams(window.location.search).has('snap')) {
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.style.cssText = 'position:fixed;inset:0;width:100vw;height:100dvh;z-index:999999;';
    document.body.appendChild(img);
  }
  ```

#### 2. Headless Screenshot CLI Command
Pass the user's active display session variables so Firefox can bind to the GPU driver:

```bash
WAYLAND_DISPLAY=wayland-0 \
XDG_RUNTIME_DIR="/run/user/$(id -u)" \
DISPLAY=:0 \
firefox --headless \
  --window-size 390,844 \
  --screenshot "$PWD/screenshot-mobile.png" \
  "http://localhost:8080/?snap=1"
```

This captures a clean, hardware-rendered screenshot at mobile viewport dimensions.
