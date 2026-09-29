# Discoverability

Use when users may not know what actions exist, what state the system is in, what controls affect, or how to recover from mistakes.

## Core Principles

- Discoverability: users can tell possible actions and current state without documentation.
- Affordances: objects enable action. In digital UI, visible signifiers usually matter most.
- Signifiers: labels, icons, shape, placement, cursor, focus, and copy tell users where and how to act.
- Mapping: controls should align spatially or semantically with the thing they affect.
- Feedback: every action should produce timely, useful system response.
- Constraints: prevent invalid actions through structure, limits, and smart defaults.
- Conceptual models: labels and flow teach how system works from user perspective.
- Human error: slips and mistakes are design inputs; prevent, catch, and recover.
- Jakob's Law: users prefer patterns that match products they already know.
- Paradox of the active user: assume users start using product before reading help.
- Postel's Law: accept flexible input, normalize it, and return conservative, predictable output.

## Agent Checks

1. Can user identify primary action and current state at glance?
2. Do interactive elements look interactive and non-interactive elements avoid false cues?
3. Are icon-only controls paired with labels or tooltips where meaning is not universal?
4. Does each control sit near the object, row, field, or region it changes?
5. Does action feedback appear quickly, especially for async, destructive, or state-changing actions?
6. Are impossible actions disabled or hidden with reason and recovery path?
7. Do validation rules prevent invalid submission before user loses work?
8. Are undo, cancel, back, retry, or restore available for risky/common mistakes?
9. Are errors written as recovery guidance, not blame?
10. Do labels match user mental model instead of database, API, or internal team terms?
11. Does UI teach through inline examples and visible state instead of manuals?
12. Are platform/web conventions followed unless new pattern is clearly better for task success?

## Common Failure Modes

- Button label describes implementation, not user outcome.
- Toggle or checkbox changes remote state with no confirmation or feedback.
- Icon looks decorative but is clickable, or decorative icon looks actionable.
- Destructive action near safe action with same visual weight.
- Form accepts many formats but error only names one hidden expected format.

## Sources

- The Design of Everyday Things, Don Norman: https://mitpress.mit.edu/9780262525671/the-design-of-everyday-things/
- Don Norman revised-edition preface: https://jnd.org/preface-design-of-everyday-things-revised-edition/
- Laws of UX: Jakob's Law, Mental Model, Paradox of the Active User, Postel's Law, Aesthetic-Usability Effect: https://lawsofux.com/
- Interaction Design Foundation on affordances: https://www.interaction-design.org/literature/topics/affordances
- Interaction Design Foundation on signifiers: https://www.interaction-design.org/literature/topics/signifiers
