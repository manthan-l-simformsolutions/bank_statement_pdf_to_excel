---
applyTo: "src/components/**/*.tsx"
---

# Frontend (React/Next.js) Specific Instructions

## 1. React Best Practices

- Use functional components only.
- Use React hooks instead of class components.
- Destructure props in function parameters.

## 2. Next.js Guidelines

- Prefer server components where possible.
- Use dynamic imports for heavy components.
- Use next/image instead of img tags.

## 3. UI & Styling

- Use Tailwind CSS for styling.
- Avoid inline styles.
- Keep components small and reusable.

## 4. State Management

- Use useState and useReducer appropriately.
- Avoid unnecessary re-renders.
- Memoize expensive calculations using useMemo.
