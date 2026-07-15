# Choi Jung Mua GitHub Profile Design Contract

## Principles

- Present a quiet, technical profile: identity first, current role second, verifiable proof and links third.
- The signature is a near-black hero field with crisp neutral layers and a restrained system-grid motif. Cool blue communicates function; it is never ambient decoration.
- Prefer one strong composition over ornamental density. Every line, chip, label, and illustration must help identify the person, explain the work, or provide a next action.
- Build assets as reusable, intrinsic SVGs that remain legible when GitHub scales them. Do not imitate controls inside a non-interactive image.
- Use only the tokens and five primitives in this contract. Add a token here before introducing a new visual value.

## Color tokens

| Role | Token | Light value | Dark value | Use |
|---|---|---:|---:|---|
| Canvas | `--color-canvas` | `#FFFFFF` | `#0B0D10` | Page and outer SVG background |
| Surface | `--color-surface` | `#F6F8FA` | `#11151A` | Primary contained surface |
| Muted surface | `--color-surface-muted` | `#EAEEF2` | `#181D24` | Quiet bands, chips, code-like labels |
| Text | `--color-text` | `#111318` | `#F6F8FA` | Headings and body copy |
| Muted text | `--color-text-muted` | `#59636E` | `#A7B0BB` | Supporting copy and metadata |
| Border | `--color-border` | `#D0D7DE` | `#30363D` | All rules and outlines |
| Functional blue | `--color-accent` | `#0969DA` | `#58A6FF` | Links, focus, selected state, verification |
| Functional blue hover | `--color-accent-hover` | `#0550AE` | `#79C0FF` | Hover/active feedback only |

Near-black, white, and neutral grays own all surfaces and illustration mass. Blue is the only chromatic accent and is reserved for a real function: link, focus, selection, status, or verification. Do not use blue for glows, background atmosphere, decorative rules, or filler art. No unlisted color, opacity-derived pseudo-token, or gradient is allowed.

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

The responsive container for identity and hero art. It uses canvas/surface tokens, a 1px border, at most a 16px radius, and `--space-3` to `--space-5` padding. Wide mode may split copy and art; compact mode stacks them. It has no interactive state and no shadow.

### `IdentityLockup`

An eyebrow, name, role, and one concise positioning line arranged as a vertical stack. It uses display, lead, body, and mono tokens with an 8px or 16px internal rhythm. Copy remains live Markdown whenever possible; SVG duplication must not carry unique information.

### `ProofChip`

A short technology or capability label using mono text on the muted surface, a 1px border, and an 8px radius. Chips wrap; they never marquee, truncate a meaningful label, or imply certification. Default is neutral, while selected/verified may use functional blue with sufficient contrast.

### `ActionLink`

A real Markdown link with a descriptive label. Default and visited states use functional blue; hover/active use the blue-hover token; keyboard focus has a visible 2px blue outline with 2px offset. Do not draw an ActionLink inside SVG art or style inert content like one.

### `SectionRule`

A 1px neutral divider paired with a heading or section boundary. It spans its grid track, uses no gradient, and has 24px minimum clearance from adjacent body copy. It never substitutes for heading hierarchy.

## Responsive behavior

- At 375px, use the compact hero: one column, 16px outer gutter, identity before art, wrapped chips, and no horizontal scrolling. Keep essential text at 14px or larger and crop no meaningful SVG content.
- At 768px, use the tablet composition: 24px outer margins and either a balanced two-zone frame or a spacious stack. Keep the identity dominant and prevent art from reducing prose below a comfortable measure.
- At 1280px, use the wide composition: 12-column grid with identity occupying about five columns and art about seven. Cap the composition at 1200px; extra viewport width becomes canvas margin.
- SVGs must use a correct `viewBox`, preserve their intended aspect ratio, and provide wide and compact sources only when recomposition is necessary. Do not merely shrink desktop text for mobile.
- Test long names, a two-line role, wrapped chip labels, 200% zoom, and missing optional sections. The reading order remains identity, role, proof, work, actions at every width.

## Depth and motion

- Depth is borders plus neutral tonal shifts: every outline is exactly 1px using `--color-border`. Do not use glass, blur, bevels, or drop shadows.
- Radius tokens are 8px, 12px, and 16px. The ceiling is 16px; nested elements use an equal or smaller radius than their container.
- Motion is allowed only within SVG hero art when it communicates a state or sequence. Animate only `transform` and `opacity`; never animate layout, stroke geometry, color cycling, blur, or decorative particles.
- Use 160ms `ease-out` for direct feedback and at most 240ms `ease-in-out` for a meaningful state transition. Do not autoplay a continuous loop.
- Under `prefers-reduced-motion: reduce`, remove transitions and keyframes and render the final informative state immediately. The static frame must communicate the complete message.

## Accessibility and content

- Target WCAG 2.2 AA: 4.5:1 minimum contrast for normal text, 3:1 for large text and graphical boundaries, visible focus, logical headings, and descriptive link labels. Color is never the sole state cue.
- Keep meaningful text in Markdown/HTML. Every image has concise alt text describing its purpose; decorative SVGs use empty alt text. Do not repeat adjacent visible copy in alt text.
- Avoid flashing, continuous motion, parallax, hover-only disclosure, emoji-as-icon, and controls that exist only visually. Interactive targets supplied by the host page should be at least 44px in either dimension where author styling controls them.
- Content truth rules: publish only claims supported by the current README, linked repository, or an owner-provided source; never invent employers, clients, metrics, awards, credentials, dates, availability, or project outcomes.
- Name a technology only when current public work or owner-provided evidence supports it. Describe prototypes as prototypes, not shipped products. Date time-sensitive claims or omit them.
- Check every project and contact link before release. Labels must identify the destination; avoid vague “click here” copy. Do not imply that decorative art is interactive.
- The accepted accessibility and content debt is none. Any future exception must name the affected users, exact location, owner approval, remediation, and exit date in this section before release.
