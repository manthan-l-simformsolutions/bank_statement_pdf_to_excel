# Copilot Global Instructions

## 1. Code Quality

- Always use TypeScript with strict typing.
- Avoid using `any`. Prefer proper interfaces and generics.
- Follow consistent naming conventions (camelCase for variables, PascalCase for components).

## 2. Project Architecture

- Keep business logic out of UI components.
- Use service or utility layers for API calls.
- Maintain separation of concerns.

## 3. Error Handling

- Always implement proper error handling using try/catch.
- Never leave console.log statements in production code.
- Use meaningful error messages.
