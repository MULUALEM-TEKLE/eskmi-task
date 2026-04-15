# Samsung Galaxy S26 — Interactive 3D Product Showcase

### Presentation Walkthrough (~10–15 min)

---

## 1. Introduction & Goal (1 min)

**What is this project?**

An **interactive, scroll-driven 3D product showcase** for the Samsung Galaxy S26 — inspired by high-end product launch pages from Apple, Samsung, and premium tech brands.

**The objective:** Build a web experience that feels premium, immersive, and polished — not a static spec sheet, but something a user *wants* to scroll through.

**Key goals:**
- Present the Galaxy S26 through cinematic 3D animations
- Highlight specs across six feature categories (Design, Camera, AI, Processor, Battery, Display)
- Allow users to explore the phone interactively in a "hands-on" mode with orbit controls and color switching
- Deliver smooth 60fps performance with post-processing effects

---

## 2. Approach & Thinking Process (3 min)

### Initial Thinking

The starting question was: **How do modern product pages create that "wow" factor?**

I studied how brands like Apple and Samsung structure their product reveal experiences:
1. **Dramatic entrance** — the product appears full-screen, close-up
2. **Choreographed scroll** — scrolling drives a carefully timed sequence of 3D transformations
3. **Feature spotlights** — each spec section is synchronized with a distinct camera angle / phone pose
4. **Interactive closure** — at the end, the user can explore freely

This led to a two-mode architecture:
- **Scroll mode** — a scripted, timeline-driven cinematic experience
- **Hands-on mode** — free orbit controls with a color picker for the 3D phone

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **React + Three.js** (via R3F) | Declarative 3D with React's component model — best DX for complex scenes |
| **GSAP for all animation** | Industry-standard, scrub-capable timeline engine. ScrollTrigger makes scroll-driven animation trivial |
| **Lenis for smooth scroll** | Native browser scroll feels janky; Lenis creates a buttery, momentum-based scroll feel |
| **Shader-based background** | CSS gradients felt flat. A custom fragment shader with noise, mouse tracking, and scroll reactivity adds depth and life |
| **Performance-gated features** | Post-processing (Bloom, Vignette, Chromatic Aberration) and the background shader are conditionally rendered based on `navigator.hardwareConcurrency` and device type |
| **6 separate GLB models** | One per color variant, pre-loaded. Swapping materials at runtime would be cheaper, but per-model files guarantee material fidelity from the 3D artist |

---

## 3. Tech Stack & Libraries Used (2 min)

### Core Framework

| Library | Purpose |
|---|---|
| **React 18** | UI component framework |
| **Vite 7** | Dev server and bundler — fast HMR, ESM-native |

### 3D Rendering

| Library | Purpose |
|---|---|
| **Three.js** (`three`) | Low-level 3D engine — geometry, materials, lighting, shaders |
| **React Three Fiber** (`@react-three/fiber`) | React renderer for Three.js — declarative scene graph |
| **Drei** (`@react-three/drei`) | Helper components — `useGLTF`, `Environment`, `OrbitControls`, `Sparkles`, `useProgress` |
| **Postprocessing** (`@react-three/postprocessing` + `postprocessing`) | Bloom, Vignette, Chromatic Aberration — cinematic film-grade effects |

### Animation & Scroll

| Library | Purpose |
|---|---|
| **GSAP 3** (`gsap`) | Animation engine — `.to()`, `.fromTo()`, `timeline()` |
| **GSAP ScrollTrigger** | Binds GSAP timelines to scroll position with scrub |
| **@gsap/react** (`useGSAP`) | React hook for clean GSAP lifecycle management and auto-cleanup |
| **Lenis** (`lenis`) | Smooth scroll with momentum, integrates with GSAP ticker |

### Dev Tools

| Library | Purpose |
|---|---|
| **Leva** | GUI controls for tweaking 3D positions, rotations, and post-processing in real-time during development (hidden in production via `<Leva hidden />`) |
| **Puppeteer** | Automated headless browser testing for catching console errors |

---

## 4. Project Architecture (2 min)

```
eskmi-task/
├── index.html                    # Entry point
├── vite.config.js                # Vite + React plugin
├── package.json
├── public/
│   └── models/                   # 6 × Galaxy S26+ GLB files (~3.5-3.9 MB each)
│       ├── galaxy-s26-plus-black-cp.glb
│       ├── galaxy-s26-plus-cobalt-violet-cp.glb
│       ├── galaxy-s26-plus-pink-gold-cp.glb
│       ├── galaxy-s26-plus-silver-shadow-cp.glb
│       ├── galaxy-s26-plus-sky-blue-cp.glb
│       └── galaxy-s26-plus-white-cp.glb
└── src/
    ├── main.jsx                  # ReactDOM render
    ├── App.jsx                   # Root — Lenis setup, mode state, Canvas
    ├── Experience.jsx            # 3D scene — lights, environment, post-FX, orbit controls
    ├── constants.js              # COLORS array + MODELS paths
    ├── index.css                 # Full design system (690 lines)
    └── components/
        ├── canvas/
        │   ├── PhonesSwarm.jsx   # All 3D phone logic — scroll timeline + hands-on mode
        │   └── BackgroundSystem.jsx  # Custom GLSL shader background + Sparkles particles
        └── ui/
            ├── LoadingScreen.jsx # Progress bar during GLB loading
            ├── HeroText.jsx      # "The phone that thinks with you" headline
            ├── CircusTexts.jsx   # Scroll-synced narrative copy ("A New Era", "Crafted for Perfection"…)
            ├── BigS26Text.jsx    # Giant "S26" watermark text
            ├── ScrollHint.jsx    # Animated scroll-down indicator
            ├── Overlay.jsx       # Spec sections (Design, Camera, Processor, Battery, Display)
            ├── AISection.jsx     # Galaxy AI feature pills with custom scroll trigger
            ├── SpecPill.jsx      # Reusable glassmorphic spec card component
            └── HandsOnUI.jsx     # Explore button, color picker, exit button
```

### Component Relationship

```
App
├── LoadingScreen          (z: 9999, fades out on load complete)
├── HeroText               (z: 4, scrubs away on scroll start)
├── CircusTexts            (z: 4, 4 narrative slides during circus)
├── BigS26Text             (z: 2, giant watermark)
├── ScrollHint             (z: 5, disappears on scroll)
├── Canvas                 (z: 1, fixed fullscreen)
│   ├── BackgroundSystem   (custom shader + sparkle particles)
│   ├── Experience
│   │   ├── Environment    (studio preset)
│   │   ├── Lights         (directional × 3, point × 1, ambient)
│   │   ├── OrbitControls  (enabled only in hands-on mode)
│   │   ├── PhonesSwarm    (6 GLB phones — all animation logic)
│   │   └── EffectComposer (Bloom + Vignette + Chromatic Aberration)
├── Overlay                (z: 3, spec sections bound to scroll)
│   ├── Design Section
│   ├── Camera Section
│   ├── AISection
│   ├── Processor Section
│   ├── Battery Section
│   └── Display Section
├── HandsOnUI              (z: 20, explore button / color picker)
└── Scroll Container       (z: 2, virtual scroll track — 250vh + 5 × 100vh sections)
```

---

## 5. Key Features Deep Dive (4 min)

### 5.1 — The "Circus" Animation

The signature opening sequence. As the user scrolls, **6 phones** (one per color) go through a choreographed routine:

1. **Single phone, zoomed in** — screen-filling, face-down
2. **Initial spin** — rotates to reveal the back
3. **Fan out into a stack** — phones spread with slight offsets
4. **Flower formation** — phones arrange in a radial circle (like petals)
5. **Rotate and collapse** — the group spins 360°, then all phones pull to center
6. **Fade out non-active** — only the selected color remains

This is all **one GSAP timeline** scrubbed against the scroll position. Each phone's `position`, `rotation`, `scale`, and material `opacity` are animated independently.

**Code reference:** `PhonesSwarm.jsx`, lines 100–397

### 5.2 — Scroll-Synced Spec Sections

After the circus, the remaining phone transitions through **5 camera angles**, each paired with a spec overlay:

| Section | Phone Pose | Content |
|---|---|---|
| Design | Front-facing, angled | Dimensions, weight, materials |
| Camera | Rear camera close-up | Lens specs, Nightography |
| AI | Landscape, dramatic tilt | Galaxy AI features (6 pills) |
| Processor | Back view, straight | Snapdragon 8 Elite, thermal |
| Battery | Angled side view | Capacity, charging speeds |
| Display | Front-facing, final | AMOLED specs, refresh rate |

Each overlay uses GSAP `ScrollTrigger` with `toggleActions: "play reverse play reverse"` — they animate in *and* out as the user scrolls forward and backward.

**Spec pills** use `SpecPill.jsx` — a `forwardRef` component with glassmorphism styling (`backdrop-filter: blur(12px)`, semi-transparent borders).

### 5.3 — Dynamic Shader Background

A custom GLSL fragment shader creates a fluid, organic background:

- **2D noise function** generates smooth gradients
- **`uTime`** — slow animation over time
- **`uMouse`** — cursor proximity warps the noise field
- **`uScroll`** — scroll position shifts the phase
- Colors blend between deep purple (`#0f0c29`) and violet (`#302b63`)
- A vignette darkens the edges

On top of the shader plane, **Sparkles particles** (from Drei) add floating motes with mouse-driven parallax.

**Performance note:** Only rendered on high-end desktops (`hardwareConcurrency >= 4` and not mobile).

### 5.4 — Hands-On Mode

At the very bottom of the scroll, a **"✦ Explore Hands-On"** button appears. Clicking it:

1. Locks scroll (Lenis `.stop()` + `body.handson-active` class)
2. Hides all text overlays
3. Enables `OrbitControls` — drag to rotate, scroll to zoom
4. Shows a **glassmorphic bottom panel** with:
   - Interaction hint ("Drag to rotate · Scroll to zoom")
   - **6 color dots** — clicking swaps the visible GLB model instantly
   - Active color name label
   - Exit button to return to scroll mode

The camera animates smoothly back to its original position when exiting.

### 5.5 — Performance Optimizations

- **Conditional rendering** of BackgroundSystem (desktop-only) and EffectComposer (high-end only)
- **DPR capping** at 2× (`dpr={[1, Math.min(devicePixelRatio, 2)]}`)
- **GSAP `revertOnUpdate`** cleans up old scroll triggers when config/mode changes
- **Material processing** runs once on mount (camera glass transparency, AO hiding, lens metalness)
- **GLB preloading** via `useGLTF.preload()` — starts fetching all 6 models immediately
- **Lenis lag smoothing disabled** (`gsap.ticker.lagSmoothing(0)`) for consistent scroll-to-animation mapping

---

## 6. Styling & Design System (1 min)

The visual language is built around a **dark premium aesthetic**:

- **Font:** Inter (Google Fonts) — weights 300–900
- **Accent color:** `#8e82fe` (soft violet) — used in eyebrows, accent lines, pill icons, progress bar, explore button
- **Background:** `#050505` (near-black)
- **Glassmorphism:** `backdrop-filter: blur()` on pills, panels, and buttons with semi-transparent borders
- **Text hierarchy:**
  - Eyebrows: uppercase, letterspaced, violet
  - Headlines: `clamp(2rem, 5vw, 4rem)`, weight 900, text-shadow
  - Body: weight 300, reduced opacity
- **Responsive:** Mobile breakpoint at 768px — pill grids collapse to single column, padding reduces

---

## 7. How Everything Assembles Together (2 min)

### The User Journey

```
┌─────────────────────────────────────────────────┐
│  1. PAGE LOAD                                    │
│     └─ LoadingScreen shows progress bar           │
│     └─ 6 GLB models load in parallel (~22 MB)     │
│     └─ Screen fades out with blur + scale          │
├─────────────────────────────────────────────────┤
│  2. HERO STATE                                   │
│     └─ HeroText visible: "The phone that thinks…" │
│     └─ ScrollHint pulses at bottom                 │
│     └─ Background shader animates subtly           │
├─────────────────────────────────────────────────┤
│  3. SCROLL → CIRCUS (0–35% scroll)               │
│     └─ HeroText scrubs away                        │
│     └─ CircusTexts cycle through 4 narrative slides│
│     └─ PhonesSwarm: spin → stack → flower → merge  │
│     └─ BigS26Text fades in as watermark            │
├─────────────────────────────────────────────────┤
│  4. SCROLL → SPEC SECTIONS (35–100%)             │
│     └─ Single phone transitions through 6 poses   │
│     └─ Overlay sections toggle in/out per section  │
│     └─ SpecPills animate with staggered entrance   │
├─────────────────────────────────────────────────┤
│  5. SCROLL END                                   │
│     └─ "Explore Hands-On" button appears           │
├─────────────────────────────────────────────────┤
│  6. HANDS-ON MODE                                │
│     └─ Scroll locked, overlays hidden              │
│     └─ OrbitControls enabled                       │
│     └─ Color picker panel slides up                │
│     └─ User rotates, zooms, switches colors        │
│     └─ "Exit" returns to scroll mode               │
└─────────────────────────────────────────────────┘
```

### Data Flow

```
constants.js
  ├── COLORS[] ───→ HandsOnUI (color dots)
  └── MODELS[] ───→ PhonesSwarm (useGLTF)

App (state: mode, activeColorIndex)
  ├──→ Experience     (mode → OrbitControls enable/disable)
  │     └──→ PhonesSwarm (mode, activeColorIndex, config → animation)
  ├──→ Overlay         (mode → visibility)
  ├──→ HandsOnUI       (mode, setMode, activeColorIndex, setActiveColorIndex)
  ├──→ CircusTexts     (scroll-driven, independent)
  ├──→ HeroText        (scroll-driven, independent)
  └──→ LoadingScreen   (useProgress → active/progress)
```

---

## 8. Development Workflow & Iteration (1 min)

The project evolved through **8 commits**, from first commit to final polish:

1. `first commit` — initial scaffold
2. `feat: implement dynamic shader background` — custom GLSL + sparkles
3. `refactor: optimize animations, refine UI layout` — performance tuning
4. `refactor: introduce SpecPill component` — extracted reusable pill component + centralized constants
5. `fix: update Canvas shadows` — PCFShadowMap for correctness
6. `chore: remove tsc from build` — cleanup
7. `feat: update loading screen UI` — progress bar + scroll lock integration
8. `style: enhance loading screen transition` — final polish on loading → hero transition

**Leva** was invaluable during development — every 3D position, rotation, and post-processing value was tuneable in real-time without reloading.

---

## 9. Summary

| Aspect | Detail |
|---|---|
| **Framework** | React 18 + Vite 7 |
| **3D** | Three.js via React Three Fiber + Drei |
| **Animation** | GSAP 3 + ScrollTrigger + Lenis |
| **Post-FX** | Bloom, Vignette, Chromatic Aberration |
| **Background** | Custom GLSL shader + Sparkles particles |
| **Models** | 6 × Galaxy S26+ GLBs (6 color variants) |
| **Modes** | Scroll (cinematic) + Hands-on (interactive) |
| **Sections** | Design, Camera, AI, Processor, Battery, Display |
| **UI** | Glassmorphic pills, color picker, animated overlays |
| **Performance** | Feature-gated rendering, DPR capping, preloading |
| **Design** | Inter font, violet accent, dark premium aesthetic |
| **CSS** | 690 lines, responsive, glassmorphism, keyframe animations |
| **Total Components** | 13 React components |

---

*Thank you!*
