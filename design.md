# Design system for handbooks and codebase guides

Use this file whenever you generate a handbook, a roadmap page, or a detailed codebase walkthrough for this repo. The reference implementation is `DEV/Frontend/Frontend_Handbook.html`. Copy its CSS tokens instead of inventing new ones.

The look is near-black with warm cream text. Monochrome, quiet, soft corners, thin lines. Color comes from the palette below and nowhere else.

## Palette

| Token | Dark theme | Light theme | Used for |
|---|---|---|---|
| `--bg` | `#0a0a0a` | `#fffaf0` | Page background (the primary color) |
| `--surface` | `#1a1a1a` | `#faf5e8` | Code blocks, demo panels, stage nodes |
| `--surface-2` | `#1f1f1f` | `#ebe6d6` | Inner fills, inputs |
| `--line` | `#1f1f1f` | `#ebe6d6` | Hairline dividers and card borders |
| `--line-strong` | `#3a3a3a` | `#9a9a9a` | Hover borders, node borders, table frames |
| `--text` | `#fffaf0` | `#0a0a0a` | Headings and emphasis |
| `--body` | `#e5e5e5` | `#1a1a1a` | Paragraph text |
| `--muted` | `#9a9a9a` | `#6a6a6a` | Secondary text, labels |
| `--faint` | `#6a6a6a` | `#9a9a9a` | Decorative only: edges, big numerals, disabled |
| `--primary` | `#fffaf0` | `#0a0a0a` | Filled buttons, "done" state, focus ring |
| `--on-primary` | `#0a0a0a` | `#fffaf0` | Text on a primary fill |

The full set from the source swatch is `#0a0a0a #fffaf0 #faf5e8 #ebe6d6 #e5e5e5 #1f1f1f #3a3a3a #1a1a1a #6a6a6a #9a9a9a`. Do not add other colors, gradients, or colored shadows.

Contrast rule: never put text smaller than 18px in `--faint`. In dark mode `#6a6a6a` on `#0a0a0a` is only about 3.6:1, and in light mode `#9a9a9a` on cream is about 2.6:1. Both are for lines and decoration. Secondary text uses `--muted`.

The dark theme is the default. Offer a light/dark toggle and remember the choice in `localStorage` inside a try/catch.

## Typography

Typeface is Inter. Use the stack `Inter, "Segoe UI", system-ui, -apple-system, sans-serif`, with no web-font download so pages stay offline. Code uses `ui-monospace, "Cascadia Code", Consolas, Menlo, monospace`.

| Token | Size / line height | Weight | Used for |
|---|---|---|---|
| display | `clamp(32px, 5vw, 48px)` / 1.1 | 600 | Page title |
| h2 | 28px / 1.2 | 600 | Stage or chapter title |
| h3 | 17px / 1.35 | 600 | Topic card title |
| lead | 17px / 1.6 | 400 | Intro paragraph under a title |
| body | 15px / 1.7 | 400 | Paragraphs, lists |
| small | 13px / 1.5 | 400 | Captions, node labels |
| label | 12px / 1.4, uppercase, 0.08em tracking | 500 | Eyebrows, table headers |
| stat | 28px / 1.1 | 600 | Numbers in the stat grid |
| numeral | 48px / 1 | 600 | Stage numbers, in `--faint` |
| code | 13px / 1.6 | 400 | Blocks (inline code is 0.88em) |

## Shape and spacing

- Base radius 12px for cards, panels, and stage nodes. 8px for small nodes, inputs, and code chips. Fully round (999px) for buttons and pills.
- Borders are always 1px. Depth comes from borders and surface fills, never shadows.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 (px). Use nothing outside it.

## Signature motifs

1. Hairline grid. Stats and key facts sit in cells separated by 1px lines inside one rounded frame, like the swatch row in the reference image.
2. Roadmap graph. Chapters are nodes on a vertical spine joined by arrowed edges. Sub-topics are smaller nodes on either side, joined by dashed curves. This is inspired by roadmap.sh. Click a node to jump to its section.
3. Cards on a hairline. Topic cards have a `--line` border and no fill. On hover or `:target` the border becomes `--line-strong` or `--primary`.

## Components

| Component | Rules |
|---|---|
| Top bar | Sticky, 56px, translucent `--bg` with blur, hairline underneath. Brand left, search and theme toggle right. |
| Table of contents | Sticky left column from 1100px up. Active chapter is `--text` with a `--primary` marker. Hidden below that width. |
| Stat grid | Four cells, 2 columns on phones. |
| Roadmap stage node | `--surface` fill, `--line-strong` border, 12px radius, number label above the title. Done state is a `--primary` fill. Active state is a `--primary` border. |
| Roadmap branch node | `--bg` fill, 8px radius, 13px muted text. Hover turns the border `--primary`. |
| Edges | Spine edges are 2px solid `--muted` with an arrowhead. Branch edges are 1.5px dashed `--faint`. Phones show the spine only. |
| Stage header | Numeral, title, lead paragraph, and a "Mark learned" pill button on the right. |
| Topic card | 24px padding, 12px radius, h3, short paragraph or list, optional code block. |
| Code block | `--surface` fill, `--line` border, 12px radius, scrolls horizontally. No syntax colors. |
| Callout | 3px `--primary` left rule on a `--surface` fill. |
| Demo panel | `--surface` fill, `--line-strong` border, controls above, result below, generated code underneath. |
| Table | Collapsed borders, `--line` row dividers, label-style header. Wrap in a scroll container on phones. |
| Buttons | Outline pill by default. The filled pill (`--primary`) marks a chosen or finished state. |
| Search | Filters topic cards live and hides empty chapters. The `/` key focuses it. |
| Pager | Previous and next chapter links at the end of each stage. |

## Content rules

- Sentence-case headings. Plain words. No emoji.
- Each topic card says what the thing is, why it exists, and what to look up next. It does not teach every detail.
- Add a snippet only when 3 to 8 lines make the idea clearer.
- Every chapter ends with a "Go deeper" line pointing at a real next step.

## Technical rules

- One self-contained HTML file. No CDN scripts, no web fonts, no frameworks. Plain CSS and a small amount of vanilla JS.
- Content lives in static HTML so it reads without JavaScript. JS builds the roadmap, table of contents, pagers, search, and demos from that markup.
- Respect `prefers-reduced-motion`. Keep visible focus rings (2px `--primary`, 3px offset).
- Layout works at phone width with a 16px side gutter and no horizontal page scroll.
