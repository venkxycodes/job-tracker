# Interaction States

Use when reviewing controls, responsiveness, touch targets, async behavior, loading, empty states, errors, success states, progress, or recovery.

## Core Principles

- Fitts's Law: target acquisition depends on distance and size. Frequent actions should be large, nearby, and reachable.
- Doherty Threshold: interaction feels productive when feedback keeps pace, roughly under 400ms.
- Flow: avoid interruptions and context switches during focused tasks.
- Peak-End Rule: users remember emotional peak and final state strongly.
- Goal-gradient effect: visible progress increases motivation near completion.
- State completeness: design is not done until loading, empty, error, partial, success, and recovery states are covered.
- Humane errors: preserve work, explain cause, and guide next action.

## Agent Checks

1. Are frequent actions near user focus and easy to hit on touch and pointer devices?
2. Are tap/click targets large enough and spaced to avoid accidental activation?
3. Does every state-changing action show pending, success, failure, and final state?
4. Does async feedback appear immediately, with skeleton/progress when wait is meaningful?
5. Do loading states preserve layout and explain what is happening when needed?
6. Does empty state explain value, why empty, and next best action?
7. Do partial states remain useful with sparse/incomplete data?
8. Do errors preserve user input and give specific recovery steps?
9. Are destructive actions confirmed, reversible, delayed, or otherwise protected?
10. Does success state confirm outcome and offer next action?
11. Does progress show steps remaining, save/resume, and completion where useful?
12. Are interruptions, modals, and forced context switches justified by user risk?

## Common Failure Modes

- Button disables on submit with no spinner, leaving user unsure.
- Error toast disappears before user can act.
- Empty dashboard says "No data" without setup path.
- Infinite loading gives no retry or failure state.
- Final confirmation fails to explain what changed.

## Sources

- Laws of UX: Fitts's Law, Doherty Threshold, Flow, Goal-Gradient Effect, Peak-End Rule, Parkinson's Law: https://lawsofux.com/
- Designing Products People Love, Scott Hurff: https://www.oreilly.com/library/view/designing-products-people/9781491923696/
- Designing Interfaces, Jennifer Tidwell, Charles Brewer, and Aynne Valencia: https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/
- The Design of Everyday Things, Don Norman: https://mitpress.mit.edu/9780262525671/the-design-of-everyday-things/
