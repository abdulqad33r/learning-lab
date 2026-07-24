# debouncing

tags: frontend

runtime: react

date: 2026-07-24

## What

Delays an action until a certain period of inactivity has passed. If the event happens again before the delay ends, the timer resets.

## Snippet

See useDebounce.ts

## When to use

Use debouncing to avoid performing expensive operations too frequently, such as:

- Search inputs (API requests)
- Filtering or sorting large datasets
- Window resize events
- Autocomplete suggestions
- Form validation while typing

**Example:** Instead of sending an API request on every keystroke, wait 500 ms after the user stops typing, then send a single request.
