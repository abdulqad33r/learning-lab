# throttling

tags: frontend

runtime: react

date: 2026-10-15

## What

Limits how often a function can execute within a certain period. Events that happen during the cooldown are skipped for immediate execution, while the latest event's arguments can be saved for a trailing execution when the cooldown ends.

## Snippet

See useThrottle.ts, useMouseMove.ts, and useThrottledValue.ts

## When to use

Use throttling to limit how frequently a function executes when events happen repeatedly, such as:

- Mouse movement and pointer tracking
- Scroll event handlers
- Window resize events
- Updating UI based on continuous user interactions
- Limiting frequent state updates
- Expensive operations that should execute at controlled intervals

**Example:** Instead of executing a callback for every mouse movement, execute it at most once per interval, using the latest mouse coordinates for a trailing execution when the cooldown ends.
