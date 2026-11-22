# AGENTS.md

jwtg: Node CLI that signs a JWT from a JSON payload file and prints it or copies it to the clipboard. No server, no network. Published on npm as `jwtg`.

## Stack

- Node.js >= 20 (`package.json` engines), CommonJS
- Dependencies: `jsonwebtoken`, `clipboardy`
- Single-file CLI: `index.js`

## Commands

```bash
npm install
node index.js <secret> <payload.json>   # run from source
node index.js --help                    # also -h
node index.js --version                 # also -v
npm i -g jwtg                           # install the published CLI
```

`package.json` has no test or lint script.

## Structure

- `index.js` - CLI entry: arguments, JSON file reading, signing, output
- `docs/readme/` - README images
- `.github/workflows/` - `validate.yml`, `security.yml`, `sast.yml` (reusable workflows from `juninmd/base-actions`) and `release-drafter.yml` (release draft)

## Conventions

- Each file stays under 180 lines (repo rule from the previous AGENTS.md).
- Code changes need approval from the lead developer before merge, and must be documented and tested first (repo rules from the previous AGENTS.md).
- Target 80% test coverage (previous AGENTS.md). The repo has no test suite yet.

<!-- base-actions-main-policy -->
## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.

## Gotchas

- The `1.1.3` tarball on npm does not set `process.exitCode = 1` on path and JSON errors, while `index.js` in this repo does. Scripts that depend on the exit code must check the installed version with `npm ls -g jwtg` (see README).
- The JWT secret is passed on the command line. Never log it or commit it in examples.
