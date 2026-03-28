# Hover Background Idea

## Project Card Hover Test

Idea: reuse the visual language of the top hero background inside `Selected Work` cards on hover.

What worked:
- Use a lightweight CSS-only approximation of the hero palette, not the full `StitchBackground` WebGL canvas per card.
- Add an absolutely positioned overlay inside each project card.
- Keep the card itself `relative` and `overflow-hidden` so the effect stays clipped to the card bounds.
- Fade the overlay in only on `.group:hover`.
- Place the project text/content in a higher layer with `relative z-10`.
- Add a dark overlay above the animated blobs so text stays readable.

Suggested structure if re-adding:
- Card wrapper: `relative overflow-hidden group`
- Background layer:
  - base black layer
  - 3 animated blurred blobs using the same hero colors
  - semi-transparent dark overlay
- Content layer: `relative z-10`

Recommended CSS pieces:
- `@keyframes` for 3 moving blobs
- `.project-stitch-bg`
- `.project-stitch-base`
- `.project-stitch-blob`
- `.project-stitch-blob-1/2/3`

Reason this approach was chosen:
- Reusing the actual hero `StitchBackground` component per card would mean multiple animated WebGL canvases, which is heavier and harder to control.
- The CSS version is visually close enough for testing and easier to tune or remove.

If you want to restore it later:
1. Re-add the hover-background CSS block to the inline `<style>` in `src/pages/HomePage.tsx`.
2. Re-add the `project-stitch-bg` overlay markup inside each project card.
3. Make the card wrapper `relative overflow-hidden`.
4. Keep the text container on `z-10`.
