# Visual Systems

Use when reviewing or designing layout, spacing, typography, color, depth, imagery, responsive behavior, or design-token consistency.

## Application first

Start from the application's existing visual language:

1. Identify shared components and tokens.
2. Compare nearby interfaces that solve similar problems.
3. Reuse established spacing, type, color, radius, depth, and motion patterns.
4. Change or extend the system only when its current pattern creates the user problem or cannot express the required hierarchy.

A redesign should look intentional within its product, not like a generic replacement pasted into it.

## Hierarchy

- Combine size, weight, contrast, position, and spacing; size alone is weak hierarchy.
- Make the primary content or action dominant by de-emphasizing competitors before making it louder.
- Keep primary, secondary, and tertiary actions visually distinct.
- Let semantic and visual hierarchy serve different jobs: preserve correct heading structure while styling each heading for its actual importance.
- Group labels, values, helper text, and controls by proximity. Space within a group must be smaller than space between groups.
- Omit labels when the content is self-evident. Integrate label and value when that produces a clearer phrase.
- Limit simultaneous emphasis. Multiple bold colors, badges, borders, and animations cancel one another out.

## Spacing and layout

- Use the application's spacing scale. Avoid one-off values when an existing token communicates the same relationship.
- If no scale exists, propose the smallest useful non-linear scale rather than choosing every gap independently.
- Start with generous whitespace, then tighten where density supports the task.
- Constrain reading and form widths with `max-width`; do not make content expand merely because the viewport does.
- Treat grids as tools. Use fixed or bounded regions when proportional columns would damage readability or task flow.
- Preserve grouping and priority at every breakpoint. Mobile stacking must not separate a control from its label, state, or action.
- Let elements scale independently: display text, body text, controls, and whitespace do not need the same responsive ratio.
- Align numbers for comparison and align mixed-size text by baseline.

## Typography

- Reuse the product's typefaces, scale, and weights.
- Most interfaces need only a normal and an emphasis weight; add more only when they communicate a real distinction.
- Keep body copy roughly 45–75 characters per line.
- Increase line height for smaller text and wider measures; tighten it for large display text.
- Left-align sustained reading. Center only short headings or brief supporting copy.
- Tighten tracking on large display text and loosen it on all-caps labels when needed for legibility.
- In link-dense interfaces, use weight, underline, or hover treatment instead of coloring every link.
- Prefer direct, scannable copy over visual styling that compensates for vague language.

## Color

- Reuse semantic tokens rather than choosing colors per component.
- Ensure text and controls meet the applicable contrast requirements.
- Never use color as the only signal for status, selection, validation, or risk.
- On colored surfaces, use a compatible tinted foreground with sufficient contrast instead of a disconnected neutral gray.
- Build palettes as related ranges with clear roles for surfaces, text, borders, actions, and states.
- Check hierarchy in grayscale. If priority disappears without hue, strengthen structure and contrast.
- Reserve saturated or high-contrast colors for elements that deserve attention.

## Depth and boundaries

- Use spacing or surface changes before adding a border around every group.
- Use elevation consistently: elements that float above content should share a coherent shadow or surface treatment.
- Model light consistently when the application uses depth; raised and inset elements should not imply conflicting light directions.
- Use stronger elevation for temporary layers such as popovers, drawers, and dialogs than for persistent controls.
- Do not turn every section into a card. Add a boundary only when grouping, interaction, or hierarchy needs it.
- Overlap and layering can create emphasis, but must not obscure reading order, focus order, or responsive behavior.

## Images and icons

- Use imagery that explains the product, place, object, or outcome rather than decorative filler.
- Do not enlarge small icons beyond the detail they were designed for; use a supporting container when more presence is needed.
- Do not shrink detailed screenshots until their content becomes illegible. Crop to the relevant region or use a simpler representation.
- Crop user-provided images consistently and protect edges from blending into surrounding surfaces.
- Ensure text over imagery remains legible across the full range of possible images.
- Keep icon style, stroke weight, optical size, and alignment consistent with the application.

## Controls and states

- Keep frequent actions close to the content they affect and large enough for the relevant input modes.
- Use immediate feedback for state changes. Preserve layout during loading when movement would disrupt the task.
- Empty states should explain the value or missing prerequisite and offer the next useful action.
- Errors should preserve user work, identify the issue, and explain recovery.
- Success states should confirm the outcome and clarify what happens next.
- Hide or disable controls that have no meaning in the current state, but preserve discoverability when the user needs to understand why.

## Motion

- Use motion to explain hierarchy, continuity, state change, or spatial relationships.
- Match existing durations and easing.
- Avoid animation that competes with the primary task or delays interaction.
- Respect reduced-motion preferences and preserve meaning without animation.

## Diagnostic checks

- Does the component use existing tokens and components where appropriate?
- Is the most important information or action visually dominant?
- Does grouping remain understandable without borders or color?
- Are action levels distinct?
- Are prose width and line height comfortable?
- Does responsive layout preserve priority and relationships?
- Are loading, empty, error, success, and recovery states visually complete?
- Are controls legible, reachable, and operable across input modes?
- Does visual polish clarify the task instead of decorating around unresolved friction?
