---
name: ui-ux
description: Provides general interface design and usability guidance for clarity, hierarchy, cognition, discoverability, navigation, content, forms, interaction states, visual systems, accessibility, and ethical UX. Use when explicitly invoked: /ui-ux (Cursor, Claude) or $ui-ux (Codex), or when loaded by a workflow such as /redesign-this.
disable-model-invocation: true
---

# UI/UX

Use this skill as a knowledge base for judging and designing interfaces. Optimize for user understanding and task success while preserving the product's established visual language and interaction model.

For a workflow that audits and redesigns a specified existing component, use `/redesign-this`.

## Core principles

- **Purpose before presentation:** Make the interface's function, value, and next action understandable within seconds.
- **User task before implementation shape:** Organize around what the user is trying to accomplish, not database fields, API boundaries, or internal terminology.
- **Application before generic advice:** Reuse established components, tokens, patterns, and language unless they cause the problem being solved.
- **Hierarchy before decoration:** Use content order, grouping, spacing, size, weight, and contrast to direct attention before adding visual effects.
- **Recognition before recall:** Keep required context visible and use clear labels, defaults, examples, previews, and constraints.
- **One primary decision at a time:** Make the most important action dominant and keep rare or secondary actions available without letting them compete.
- **Complete states:** Account for first-run, ideal, loading, empty, partial, error, success, and recovery states where relevant.
- **Accessible by default:** Preserve semantics, contrast, focus, keyboard use, touch targets, reduced motion, and non-color cues.
- **Evidence before taste:** Connect recommendations to observed behavior, research, a named heuristic, or a clearly labeled assumption.
- **Agency before conversion:** Make consequences clear and preserve informed choice, refusal, cancellation, and recovery.

## Reference map

Load only the references relevant to the current question:

- [COGNITION.md](COGNITION.md): choice, memory, cognitive load, progressive disclosure, and complexity.
- [DISCOVERABILITY.md](DISCOVERABILITY.md): affordances, signifiers, mapping, feedback, mental models, constraints, and human error.
- [NAVIGATION-IA.md](NAVIGATION-IA.md): scanning, wayfinding, conventions, labels, search, and information architecture.
- [VISUAL-HIERARCHY.md](VISUAL-HIERARCHY.md): grouping, proximity, emphasis, attention, reading order, and responsive hierarchy.
- [INTERACTION-STATES.md](INTERACTION-STATES.md): targets, speed, feedback, loading, empty, error, success, progress, and recovery.
- [CONTENT-FORMS.md](CONTENT-FORMS.md): headings, labels, calls to action, forms, helper text, validation, and microcopy.
- [VISUAL-SYSTEMS.md](VISUAL-SYSTEMS.md): spacing, typography, color, depth, imagery, responsive composition, and design tokens.
- [ETHICS.md](ETHICS.md): consent, persuasion, pricing, privacy, cancellation, and dark-pattern risks.

## Applying the guidance

1. Identify the user, immediate task, interface purpose, and product context.
2. Inspect the existing design system and nearby patterns before proposing a new one.
3. Load the smallest relevant reference set.
4. Evaluate the interface against the concrete task and relevant states.
5. Explain user impact and the smallest coherent improvement.

When principles conflict, prioritize task success, accessibility, truthful communication, and consistency with the application. A heuristic is evidence for a design decision, not a rule that overrides context.

When evidence is incomplete, distinguish:

- **Observed:** visible in the supplied interface or code.
- **Research-backed:** supported by user evidence or product data.
- **Heuristic:** inferred from established interface principles.
- **Assumption:** plausible but unverified.
