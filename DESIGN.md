# Brick Breaker — design system

An arcade cabinet translated to a browser: a charcoal frame around a dark playfield, warm ivory controls, and bands of sunset-coloured bricks. The game itself is the hero; no marketing layout or decorative assets compete with it. This direction was agreed with Rosario; the exact colour values, spacing and typography below were chosen in the build.

## Tokens

All colours live in `src/app/globals.css`; components use semantic Tailwind utilities and the canvas reads the game colours from CSS custom properties. The arcade keeps the same dark palette in both system colour schemes.

| Token | Value | Purpose |
| --- | --- | --- |
| `--background` | `#111519` | Outer cabinet |
| `--foreground` | `#f4ebd7` | Text, ball, paddle |
| `--card` | `#1c2225` | Cabinet and control surfaces |
| `--muted` | `#283034` | Recessed surfaces |
| `--muted-foreground` | `#abb8ae` | Labels and hints |
| `--primary` | `#f6b45b` | Main action and score emphasis |
| `--primary-foreground` | `#161a1d` | Text on main action |
| `--border` | `#455148` | Edges and separators |
| `--ring` | `#f6b45b` | Keyboard focus |
| `--destructive` | `#f37861` | Failure indicator |
| `--brick-red` | `#eb695e` | First brick row |
| `--brick-orange` | `#f29554` | Second row |
| `--brick-yellow` | `#f7c868` | Middle row |
| `--brick-mint` | `#a5c9a0` | Fourth row |
| `--brick-blue` | `#6eafb5` | Last row |
| `--playfield` | `#141b1f` | Canvas background |

The shadcn secondary, accent, popover, sidebar and input tokens derive from those same cabinet colours. `@theme inline` exposes each custom game colour as a Tailwind utility when needed. No colour is hardcoded inside a component.

## Type and shape

- Display headings and score numerals: Press Start 2P, loaded via `next/font` and exposed as `--font-display`.
- Body text and instructions: Space Mono, loaded via `next/font` and exposed as `--font-body`.
- Scale: compact labels 0.65–0.8rem; body 0.875–1rem; heading 1.35–2.7rem depending on viewport. Display text is used sparingly for legibility.
- Small display labels use `--text-arcade-label: 0.65rem`; the responsive game title uses `--text-arcade-hero: clamp(1.35rem, 4.3vw, 2.7rem)`.
- Radius: `--radius: 0.375rem`; cabinet corners are restrained, like painted metal.
- Main content width: `--content-width: 1000px`, centred; 16px minimum side padding. Spacing steps: 4, 8, 12, 16, 24, 32, 48px.
- The board is a 720 × 480 logical canvas rendered responsively at a 3:2 aspect ratio; its physics never depends on display pixels.

## Components and language

- shadcn/ui buttons for actions; standard links for navigation. One main action at a time. Focus is visible; tap controls are generous.
- Keep the surrounding UI calm. The canvas supplies the movement, while the page supplies readable score, lives and state text outside it.
- Every visible string exists in Italian and English. Language follows the browser initially and can be switched at any time.
- Voice: short arcade labels, straightforward instructions and explicit win/loss messages; no generic placeholders.

## Never

- Colours or one-off typefaces inside a component; change the tokens above and in `globals.css` instead.
- Animations that interfere with tracking the ball, fake features, or interface panels unrelated to playing.
