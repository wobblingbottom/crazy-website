## Project overview

This is a minimal TypeScript library project for demonstrating AI-assisted code quality rules.
Source code is in `src/`.
Tests are in `tests/`.
Configuration files include `package.json`, `tsconfig.json`, `.eslintrc.json`.
Do not modify unrelated directories or add files outside the minimal task scope.

## Development commands

- Install dependencies: `npm install`
- Run unit tests: `npm test`
- Run linting: `npm run lint`
- Run type checking: `npm run typecheck`
- Run the build check: `npm run build`
- Run formatter check: `npm run format`

## Code style

- Use TypeScript strict typing.
- Do not use `any` unless there is a clear and documented reason.
- Keep new functions small and focused.
- Prefer existing code and helper functions rather than duplicating logic.
- Preserve the existing folder structure: keep runtime code in `src/` and tests in `tests/`.
- Use ES module imports and `.js` extension in runtime imports for TypeScript with `module: ESNext`.

## Testing rules

- New functionality must include tests in `tests/`.
- Bug fixes must include a regression test that fails before the fix and passes after the fix.
- Do not remove existing tests unless they are clearly obsolete and the reason is documented in the change description.
- Before marking work complete, run the full test suite with `npm test`.
- If the task touches behavior, add or update tests for edge cases.

## Git workflow

- Never commit directly to `main`.
- Create or use a feature branch for every change.
- Keep pull requests small and focused.
- Do not mark a task complete if tests, linting, type checking, or build checks fail.
- Explain every changed file in the final summary.
- Do not make changes outside the files directly related to the requested task.

## Scope control

- Only change files that are directly related to the task.
- Do not refactor unrelated code.
- Do not rename public functions, routes, components, or exported types unless explicitly requested.
- If a change requires touching more than 5 files, first explain why and ask for confirmation.
- Do not perform broad architecture changes for a small bug fix.

## Security rules

- Never commit secrets, API keys, tokens, passwords, or private credentials.
- Do not add logs that expose sensitive input or user data.
- Do not disable authentication or authorization checks to make tests pass.
- Do not bypass type safety or runtime checks for speed or convenience.

## Dependency rules

- Do not add new production dependencies without explaining why they are necessary.
- Prefer existing project dependencies for new functionality.
- Check whether the same functionality already exists in the project before adding a package.
- If a dependency is necessary, explain its purpose and the alternatives considered.

## Completion checklist

Before saying the task is complete:

- [ ] Review the changed files.
- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `npm run format`.
- [ ] Confirm that no unrelated files were changed.
- [ ] Confirm that no secrets were added.
- [ ] Summarize what changed and why.

## When unsure

- Ask for clarification before changing architecture, module boundaries, public APIs, or the project structure.
- If a requirement is ambiguous, propose a short plan before editing code.
- If tests fail and the cause is unclear, report the failure instead of guessing.
- If a change requires deleting files, altering `main`, or adding dependencies, ask for explicit confirmation.
