---
name: redesign-this
description: Audits and redesigns a specified existing interface or component so it is cleaner, easier to use, and clearer about its function or value while remaining consistent with the application. Use only when explicitly invoked: /redesign-this (Cursor, Claude) or $redesign-this (Codex).
argument-hint: "Component, screen, screenshot, URL, or file path to redesign"
disable-model-invocation: true
---

# Redesign This

Redesign the specified interface using the principles in [`../ui-ux/SKILL.md`](../ui-ux/SKILL.md). Produce one coherent fix that reduces friction and belongs in the existing application.

## Workflow

### 1. Frame the redesign

Identify the supplied artifact, requested scope, target user, immediate task, component function or value, and primary action or information. Infer these from the application when evidence is available. Label uncertain conclusions as assumptions and ask only when a missing answer would materially change the redesign.

Before changing anything, define task-specific acceptance criteria. Include an observable before/after comparison such as fewer decisions, a shorter task path, clearer action hierarchy, successful state recovery, or improved visual comprehension.

### 2. Inspect context

Inspect the containing screen, shared components, design tokens, product language, responsive conventions, and nearby interfaces that solve similar problems. Treat these as the design source of truth. Add a new pattern only when existing patterns cannot solve the identified friction.

### 3. Apply UI/UX guidance

Read [`../ui-ux/SKILL.md`](../ui-ux/SKILL.md) and only the references relevant to the component. Diagnose the current interface against its concrete user task. Rank findings by user impact and distinguish observed evidence, research, heuristics, and assumptions.

### 4. Design one coherent fix

Resolve related findings as one composition. Specify the revised hierarchy, layout, copy, actions, interactions, responsive behavior, relevant states, and existing components or tokens to reuse. Prefer removing, combining, reordering, and de-emphasizing before adding decoration or controls.

### 5. Implement when requested

If the user asked to change code, carry the redesign through implementation. Keep changes scoped to the specified interface and directly supporting shared pieces. Preserve application architecture and behavior unless changing them is necessary to remove the diagnosed friction.

### 6. Verify the outcome

Walk through the primary task before and after the change. Compare the result with the acceptance criteria and, when available, use screenshots or a visual diff. Exercise relevant responsive layouts, input modes, states, accessibility behavior, and repository checks.

Stop when the specified interface meets its acceptance criteria, remains consistent with the application, and is verified in proportion to the change.

## Response contract

For a review-only request, report:

1. the component's purpose and primary task;
2. findings ordered by user impact, each with location, impact, principle, evidence level, and concrete fix;
3. one unified redesign specification;
4. assumptions, acceptance criteria, and the planned before/after check.

For an implementation request, make the change and lead with the outcome. Summarize the important design decisions and before/after verification without repeating a long audit unless it helps review.
