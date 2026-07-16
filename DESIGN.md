# Choi Jung Mua GitHub Profile Design Contract

## Principles

- Present a quiet, technical profile: identity first, current role second, verifiable proof and links third.
- The signature is a near-black hero field with crisp neutral layers and a restrained system-grid motif. Cool blue communicates function; it is never ambient decoration.
- Prefer one strong composition over ornamental density. Every line, chip, label, and illustration must help identify the person, explain the work, or provide a next action.
- Build assets as reusable, intrinsic SVGs that remain legible when GitHub scales them. Do not imitate controls inside a non-interactive image.
- Use only the tokens and five static-profile primitives plus six live-companion primitives in this contract. Add a token here before introducing a new visual value.

## Color tokens

| Role | Token | Light value | Dark value | Use |
|---|---|---:|---:|---|
| Canvas | `--color-canvas` | `#FFFFFF` | `#0B0D10` | Page and outer SVG background |
| Surface | `--color-surface` | `#F6F8FA` | `#11151A` | Primary contained surface |
| Muted surface | `--color-surface-muted` | `#EAEEF2` | `#181D24` | Quiet bands, chips, code-like labels |
| Text | `--color-text` | `#111318` | `#F6F8FA` | Headings and body copy |
| Muted text | `--color-text-muted` | `#59636E` | `#A7B0BB` | Supporting copy and metadata |
| Decorative separator | `--color-separator` | `#D0D7DE` | `#30363D` | Non-semantic dividers and container separation only |
| Strong boundary | `--color-boundary-strong` | `#57606A` | `#6E7681` | Essential graphical boundaries; at least 3:1 against every adjacent neutral surface |
| Functional blue | `--color-accent` | `#0969DA` | `#58A6FF` | Links, focus, selected state, verification |
| Functional blue hover | `--color-accent-hover` | `#0550AE` | `#79C0FF` | Hover/active feedback only |

Near-black, white, and neutral grays own all surfaces and illustration mass. `--color-separator` is intentionally quiet: it is decorative, never conveys state, and is never the sole carrier of grouping. `--color-boundary-strong` is the neutral boundary for essential graphical objects and states. Blue is the only chromatic accent and is reserved for a real function: link, focus, selection, status, or verification. Do not use blue for glows, background atmosphere, decorative rules, or filler art. No unlisted color, opacity-derived pseudo-token, or gradient is allowed.

## Typography

- Sans: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`.
- Mono: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`.
- Fonts are local system fallbacks only. Do not load, import, embed, or fetch a remote font.

| Token | Size | Weight | Line height | Tracking | Use |
|---|---:|---:|---:|---:|---|
| `--type-display` | `clamp(32px, 5vw, 56px)` | 700 | 1.05 | `-0.03em` | Name or hero statement |
| `--type-heading` | `24px` | 650 | 1.25 | `-0.015em` | Section heading |
| `--type-lead` | `18px` | 450 | 1.55 | `0` | Role and short positioning line |
| `--type-body` | `16px` | 400 | 1.6 | `0` | Narrative and project descriptions |
| `--type-small` | `14px` | 500 | 1.45 | `0` | Metadata and supporting labels |
| `--type-mono` | `12px` | 600 | 1.4 | `0.06em` | Technical eyebrow and proof chips |

Use sentence case. Keep prose measure at 68 characters. Use mono only for short technical labels, never paragraphs. Essential type must remain selectable Markdown text; if repeated inside an SVG, it is decorative reinforcement rather than the sole source of meaning.

## Spacing and grid

The base unit is 8px. Layout dimensions, padding, gaps, and offsets use this grid; the only exception is the required 1px border.

| Token | Value | Use |
|---|---:|---|
| `--space-1` | `8px` | Tight inline gap |
| `--space-2` | `16px` | Mobile gutter, compact padding |
| `--space-3` | `24px` | Default component padding |
| `--space-4` | `32px` | Group separation |
| `--space-5` | `40px` | Section interior |
| `--space-6` | `48px` | Section separation |
| `--space-8` | `64px` | Major separation |
| `--space-10` | `80px` | Hero breathing room |

- Content max-width: `1200px`, centered.
- At 1280px and above: 12 columns, 24px gutters, 32px outer margins.
- From 768px to 1279px: 8 columns, 24px gutters, 24px outer margins.
- Below 768px: 4 columns, 16px gutters, 16px outer margins.
- Align identity, copy, rules, and art to shared column edges. Allow intrinsic mechanics such as percentages, `viewBox`, and `clamp()` without inventing spacing tokens.

## Shared primitives

### `HeroFrame`

The responsive container for identity and hero art. It uses canvas/surface tokens, a decorative 1px `--color-separator`, at most a 16px radius, and `--space-3` to `--space-5` padding. Proximity and surface tone establish grouping; the separator is never the only cue. Wide mode may split copy and art; compact mode stacks them. It has no interactive state and no shadow.

### `IdentityLockup`

An eyebrow, name, role, and one concise positioning line arranged as a vertical stack. It uses display, lead, body, and mono tokens with an 8px or 16px internal rhythm. Copy remains live Markdown whenever possible; SVG duplication must not carry unique information.

### `ProofChip`

A short technology or capability label using mono text on the muted surface, a decorative 1px `--color-separator`, and an 8px radius. Chips wrap; they never marquee, truncate a meaningful label, or imply certification. A selected or verified chip must either use `--color-boundary-strong` as a visibly distinct 2px essential boundary or pair existing high-contrast `--color-text` with functional blue and an explicit text/icon cue so the state is redundant. The decorative separator never conveys selection or verification.

### `ActionLink`

A real Markdown link with a descriptive label. Default and visited states use functional blue; hover/active use the blue-hover token. Keyboard focus uses a visible 2px `--color-boundary-strong` outline with 2px offset while the functional-blue link text supplies a redundant cue. Do not draw an ActionLink inside SVG art or style inert content like one.

### `SectionRule`

A decorative 1px `--color-separator` paired with a heading or section break. It spans its grid track, uses no gradient, and has 24px minimum clearance from adjacent body copy. It is non-semantic: the heading and spacing establish grouping, and the rule never substitutes for hierarchy or conveys state.

## Responsive behavior

- At 375px, use the compact hero: one column, 16px outer gutter, identity before art, wrapped chips, and no horizontal scrolling. Keep essential text at 14px or larger and crop no meaningful SVG content.
- At 768px, use the tablet composition: 24px outer margins and either a balanced two-zone frame or a spacious stack. Keep the identity dominant and prevent art from reducing prose below a comfortable measure.
- At 1280px, use the wide composition: 12-column grid with identity occupying about five columns and art about seven. Cap the composition at 1200px; extra viewport width becomes canvas margin.
- SVGs must use a correct `viewBox`, preserve their intended aspect ratio, and provide wide and compact sources only when recomposition is necessary. Do not merely shrink desktop text for mobile.
- Test long names, a two-line role, wrapped chip labels, 200% zoom, and missing optional sections. The reading order remains identity, role, proof, work, actions at every width.

## Depth and motion

- Depth is neutral tonal shifts plus two explicit boundary roles. Decorative dividers and container separators are exactly 1px using `--color-separator`; they are non-semantic, never convey state, and never carry grouping alone.
- An essential graphical boundary must use `--color-boundary-strong` at 1px or greater. A state or selection must either add or thicken that strong boundary to a visibly distinct 2px outline, or use existing high-contrast `--color-text` plus functional blue and an explicit redundant cue. Merely recoloring an otherwise identical separator is insufficient. Do not use `--color-separator` for an essential boundary. Do not use glass, blur, bevels, or drop shadows.
- Radius tokens are 8px, 12px, and 16px. The ceiling is 16px; nested elements use an equal or smaller radius than their container.
- For embedded README artwork, motion is allowed only within SVG hero art when it communicates a state or sequence. Animate only `transform` and `opacity`; never animate layout, stroke geometry, color cycling, blur, or decorative particles. The separate live companion page follows its own demand-rendered interaction contract below; this exception never makes README art interactive.
- Use 160ms `ease-out` for direct feedback and at most 240ms `ease-in-out` for a meaningful state transition. Do not autoplay a continuous loop.
- Under `prefers-reduced-motion: reduce`, remove transitions and keyframes and render the final informative state immediately. The static frame must communicate the complete message.

## Accessibility and content

- Target WCAG 2.2 AA: 4.5:1 minimum contrast for normal text, 3:1 for large text and essential graphical boundaries, visible focus, logical headings, and descriptive link labels. Every essential state or selection must use `--color-boundary-strong` as a visibly added/thickened outline or the existing high-contrast text plus functional-blue redundant-cue pattern. Changing only a same-width separator color is not sufficient; color is never the sole state cue.
- Decorative `--color-separator` rules are exempt from graphical-object contrast only because they are non-semantic: removing one must not erase a state, boundary needed to identify a control, or the only cue that content belongs together.
- Keep meaningful text in Markdown/HTML. Every image has concise alt text describing its purpose; decorative SVGs use empty alt text. Do not repeat adjacent visible copy in alt text.
- Avoid flashing, continuous motion, parallax, hover-only disclosure, emoji-as-icon, and controls that exist only visually. Interactive targets supplied by the host page should be at least 44px in either dimension where author styling controls them.
- Content truth rules: publish only claims supported by the current README, linked repository, or an owner-provided source; never invent employers, clients, metrics, awards, credentials, dates, availability, or project outcomes.
- Name a technology only when current public work or owner-provided evidence supports it. Describe prototypes as prototypes, not shipped products. Date time-sensitive claims or omit them.
- Check every project and contact link before release. Labels must identify the destination; avoid vague “click here” copy. Do not imply that decorative art is interactive.
- The accepted accessibility and content debt is none. Any future exception must name the affected users, exact location, owner approval, remediation, and exit date in this section before release.

## Live companion-page extension

### Boundary and truth

- The GitHub README and its embedded hero SVGs remain static, pre-rendered launch surfaces. They contain no script, WebGL, canvas, iframe, or simulated control, and must never be described as interactive.
- The live experience exists only at `https://choijungmua.github.io/choijungmua/`. It is a dark-only companion page that uses the same neutral system-field language without changing the static profile rules above.
- Interface / State / Delivery is an illustrative system model, not telemetry, a deployed architecture diagram, or evidence of a relationship between real systems. The semantic HTML copy is authoritative; canvas is an alternate visual and pointer-input surface.
- The page uses the existing local system sans and mono stacks. It introduces no remote font, unlisted color, gradient, shadow, glow, glass, blur, texture, lighting pipeline, or decorative motion.

### Companion token ledger

All companion CSS and Three.js values must resolve to this ledger or be an intrinsic calculation explicitly named here. Existing color and typography tokens remain authoritative.

| Role | Token | Value | Contract |
|---|---|---:|---|
| Authored control target | `--control-target` | `44px` | Minimum inline and block size for radio labels, view buttons, Retry, and links styled as controls |
| Decorative boundary | `--boundary-width` | `1px` | Existing `--color-separator`; never state-bearing |
| Focus and selected boundary | `--boundary-state-width` | `2px` | Visible focus and selected silhouette; paired with text/checked state |
| Focus offset | `--focus-offset` | `2px` | Keeps the focus boundary visually distinct |
| Direct feedback | `--feedback-direct` | `160ms` | Hover, active, and direct checked-state feedback only |
| Maximum state feedback | `--feedback-state-max` | `240ms` | Hard ceiling for meaningful authored transitions |
| Compact viewport | `--scene-size-compact` | `288px` | Scene block at widths up to 767px |
| Tablet viewport | `--scene-size-tablet` | `384px` | Scene block from 768px through 1023px |
| Wide viewport | `--scene-size-wide` | `min(512px, calc(100dvh - 160px))` | Scene block from 1024px; intrinsic viewport calculation |
| Content reflow | `--scene-reflow-width` | `640px` | Single-column layout below this available content width |
| Pointer click tolerance | `--scene-pick-threshold` | `8px` | Maximum fine-pointer movement that may become a raycast selection |
| Device pixel ratio | `--scene-dpr-max` | `2` | Renderer DPR is `min(devicePixelRatio, 2)` |
| Camera vertical span | `--scene-camera-span` | `10` | Orthographic top 5, bottom -5; left/right are intrinsic aspect calculations |
| Camera near/far | `--scene-camera-depth` | `0.1 / 100` | Orthographic clipping range |
| Camera default position | `--scene-camera-position` | `[8, 6, 9]` | Reset position |
| Camera target | `--scene-camera-target` | `[0, 0, 0]` | Reset and OrbitControls target |
| Camera zoom | `--scene-camera-zoom` | `1.0` | Reset zoom |
| Polar range | `--scene-polar-range` | `0.85..1.35` | Inclusive OrbitControls clamp |
| Azimuth range | `--scene-azimuth-range` | `-0.9..0.9` | Inclusive OrbitControls clamp |
| Rotate step | `--scene-rotate-step` | `Math.PI / 12` | One normalized button step |
| Zoom step and range | `--scene-zoom-step` | `1.15; 0.85..1.6` | Exponent step and inclusive clamp |
| Scene clearance | `--scene-clearance` | `0.25` | Minimum projected scene-unit margin at 343px by 288px |

Companion color/material mapping is exact: canvas and renderer clear `--color-canvas` dark (`#0B0D10`, `0x0b0d10`); slab faces use dark canvas/surface/muted-surface (`0x0b0d10`, `0x11151a`, `0x181d24`); grid uses `--color-separator` dark (`0x30363d`); edges and nodes use `--color-boundary-strong` dark (`0x6e7681`); route, focus, and selected silhouette use `--color-accent` dark (`0x58a6ff`). Intrinsic calculations are limited to safe container width/height, aspect ratio, orthographic left/right, `min(devicePixelRatio, 2)`, `Math.sign(direction)`, and the declared `min()`/`calc()` viewport expression.

### Companion primitive anatomy

#### `InteractiveHero`

Owns identity, purpose, instructions, `SceneViewport`, controls/details, and return navigation in that reading order. Default is a generous asymmetric desktop composition and a single column below `--scene-reflow-width`. Loading preserves the complete poster-first HTML. Unavailable preserves the same height and content. Reduced motion removes authored transitions without changing hierarchy.

#### `LayerControl`

A visible native `fieldset` and `legend` containing three radio inputs named `layer`, with IDs/values `interface`, `state`, and `delivery`; `interface` is checked in the static document. Default and hover use neutral surface/boundary tokens. Focus uses a visible `--boundary-state-width` accent outline with `--focus-offset`. Active may use only direct 160ms tonal feedback. Checked combines native checked state, 2px boundary, label, selected detail, and blue silhouette; color is never the sole cue. Loading and unavailable leave all radios operable. Reduced motion is immediate. `aria-pressed` is forbidden.

#### `ViewControl`

Five HTML buttons—rotate left, rotate right, zoom in, zoom out, and reset—use `--control-target`. They are hidden and non-focusable during static/loading/unavailable states and become available only after the first successful render. Hover/focus/active follow the boundary and timing tokens; there is no disabled-looking inert control. Reduced motion does not remove capability and never adds camera tweening.

#### `SceneViewport`

Owns a poster-first reserved scene block and, after successful enhancement, one `aria-hidden="true"`, `tabindex="-1"` canvas. The poster remains visible through initialization; ready swaps it for canvas without layout shift. Fine pointer drag orbits, passive wheel requests one zoom step without cancelling document scroll, and a primary click within `--scene-pick-threshold` may raycast. Coarse pointer disables OrbitControls and keeps `touch-action: pan-y pinch-zoom`; HTML controls provide parity. Focus never enters canvas. Loading, unavailable, context-lost, missing-poster, JavaScript-disabled, and reduced-motion states never remove semantic content.

#### `SceneDetail`

Shows the selected layer heading and body as live HTML and keeps all three short summaries always readable. Default is Interface. Checked selection updates this region without moving focus. Loading/unavailable/reduced-motion retain the same copy; no canvas label is the sole source of meaning.

#### `SceneStatus`

A polite atomic live region that is empty initially. It announces only explicit user selection and runtime recovery: `{Label} layer selected.`, `Interactive 3D unavailable. Layer details remain available.`, `Restoring interactive 3D.`, and `Interactive 3D restored.` Hover, focus, active, and checked are not applicable because status is not a control. Loading before first success is silent; reduced motion does not change announcements.

### Exact content contract

- Document title: `CJM — Interactive system field`
- Description: `A real-time Three.js study of interface, state, and delivery.`
- Canonical URL: `https://choijungmua.github.io/choijungmua/`
- H1: `Interface systems, explored in 3D.`
- Lead: `Drag to orbit on desktop, or use the controls to inspect each layer.`
- Interface: `Responsive product UI shaped around clear hierarchy and usable states.`
- State: `Clear state and maintainable structure keep behavior understandable.`
- Delivery: `Practical automation helps build, verify, and ship with evidence.`
- Unavailable: `Interactive 3D unavailable. Layer details remain available.`
- Retry: `Retry 3D`
- Return: `Back to GitHub profile`

### Procedural system-field contract

- Root `system-field` contains Interface `[0, 1.5, 0]`, State `[0, 0, 0]`, and Delivery `[0, -1.5, 0]` in that order. Each slab is `BoxGeometry(4.8, 0.28, 2.8)` with face material order `+X,-X,+Y,-Y,+Z,-Z` mapped to `[0x11151a, 0x0b0d10, 0x181d24, 0x0b0d10, 0x181d24, 0x11151a]`, `renderOrder=1`.
- Each slab has `EdgesGeometry` in `0x6e7681`, `renderOrder=2`, plus three local nodes at `[-1.4, 0.24, -0.6]`, `[0, 0.24, 0]`, `[1.4, 0.24, 0.6]` using `BoxGeometry(0.32, 0.16, 0.32)`, `0x6e7681`, and `renderOrder=2`.
- Immediately before each slab is `BoxGeometry(4.96, 0.36, 2.96)` selected silhouette using `MeshBasicMaterial({ color: 0x58a6ff, side: BackSide, depthTest: true, depthWrite: false })`, `renderOrder=0`. Only the selected silhouette is visible; the enlarged back faces expose a 0.08-unit perimeter without covering slab faces.
- `system-grid` is six X-parallel and six Z-parallel lines at `[-3, -1.8, -0.6, 0.6, 1.8, 3]`, spanning -4..4 on X and -3..3 on Z at Y -1.7, using `0x30363d`, `renderOrder=0`.
- `system-route` uses `[-1.6, 1.66, -0.6] -> [0, 1.66, 0] -> [1.4, 0.16, 0.5] -> [0, -1.34, 0]`, `0x58a6ff`, and `renderOrder=3`. It carries no arrow, metric, dependency label, or factual relationship claim.
- Materials are `MeshBasicMaterial` and `LineBasicMaterial` only. No Light, texture, transparency, shader, loader, post-processing, random value, shadow, or animation is permitted.

### Camera, rendering, and input contract

- One orthographic camera uses the tokenized span, near/far, position, target, zoom, polar/azimuth bounds, rotate step, zoom factor/range, and clearance above. `OrbitControls` has `enableDamping=false`, `enablePan=false`, `enableZoom=false`, and `autoRotate=false`.
- Render synchronously on first success, selection, control change, resize, and return to visible. No-idle-render invariant: no `requestAnimationFrame`, `setAnimationLoop`, damping, inertia, autoplay, or continuing render at rest/while hidden.
- Fine pointer only: drag orbits; passive wheel zoom leaves document scrolling native; primary pointer-up raycasts only at 8px movement or less and never after drag, cancel, lost capture, or a non-primary button. Coarse pointer keeps native vertical scroll and pinch zoom.
- Reset restores camera `[8, 6, 9]`, target `[0, 0, 0]`, zoom `1.0`, and Interface selection. It never animates or moves focus.

### Lifecycle, fallback, and focus matrix

The enhancement lifecycle is `static -> initializing -> ready | unavailable -> restoring -> ready | unavailable -> disposed`.

| State | View | Controls and content | Status and focus |
|---|---|---|---|
| Static / JavaScript disabled | Poster visible; canvas absent or hidden | Native radios, all summaries, detail, instructions, and return link work; view and Retry controls hidden/non-focusable | Status empty; Interface checked |
| Initializing / loading | Poster and reserved height remain | Semantic controls/content remain operable; view and Retry hidden/non-focusable | Status remains empty; no focus move |
| Ready | First successful frame reveals canvas and hides poster | Radios/detail remain; view controls appear | Initial success is silent; explicit actions announce only their result |
| WebGL unavailable | Poster restored; canvas and view controls removed/hidden | Author-styled control target: every visible control is at least 44px; radios/content/return remain; Retry appears | WebGL fallback: announce the exact unavailable copy; constructor failure does not auto-retry |
| Context lost | Poster restored without height collapse | Before hiding focused view controls, move focus to the currently checked native radio; retain one restoration listener | Announce unavailable; permit one automatic attempt on one restored event |
| Restoring | Poster remains | One attempt per restored event or Retry activation | Announce restoring; no loop |
| Restored | Canvas/view controls return | If Retry held focus, focus the checked radio before hiding Retry | Announce restored |
| Restore failed | Poster and Retry remain | All semantic content remains unchanged | Keep focus on Retry; announce unavailable |
| Reduced motion | Same state-specific surface | Every required action remains available | Zero authored transition, keyframe, camera tween, RAF, or initial reveal motion |
| Disposed | No live renderer/listeners | Static semantic content remains the durable source | No announcement or focus move |

### Accessibility, responsive, and debt closure

- A skip link, semantic landmarks, logical headings, descriptive labels, native radio keyboard behavior, visible 2px focus, 44px targets, 4.5:1 text contrast, 3:1 essential graphical contrast, and 200% zoom reflow are release requirements.
- Scene block sizes are exactly 288px at <=767px, 384px at 768-1023px, and `min(512px, calc(100dvh - 160px))` at >=1024px. Reflow to one column whenever available content width is below 640px; no horizontal document scroll, clipped control, or cropped semantic content.
- The static poster is a derived local asset, has intrinsic dimensions/aspect ratio, and cannot be the only carrier of information. A missing poster must not collapse the reserved height or expose a broken-image affordance.
- Accepted accessibility debt: none. Accepted content debt: none. Accepted design-system debt: none. Any exception requires owner approval and a new contract revision before release.
