# Coupon System Backend

A robust cart coupon system built with modern web technologies, focusing on performance, type safety, and developer experience.

## 🛠 Tech Stack & Rationale

We have carefully selected a suite of tools to ensure scalability, maintainability, and code quality.

### Core Framework

- **[Fastify](https://www.fastify.io/)**: Chosen for its high performance and low overhead. It is one of the fastest Node.js frameworks and provides an excellent plugin system.
- **[TypeScript](https://www.typescriptlang.org/)**: Used throughout the project to provide static typing, which reduces runtime errors and improves developer productivity with better tooling (autocompletion, refactoring).

### Database & ORM

- **[PostgreSQL](https://www.postgresql.org/)**: A powerful, open-source relational database system known for its reliability and feature robustness.
- **[Prisma](https://www.prisma.io/)**: A next-generation ORM that provides:
  - **Type-safe database access**: Auto-generated TypeScript client based on the database schema.
  - **Automated migrations**: Easy schema management.
  - **Intuitive data modeling**: Declarative `.prisma` schema files.

### Validation & Documentation

- **[Zod](https://zod.dev/)**: A TypeScript-first schema declaration and validation library. We use it to validate environment variables and request payloads.
- **[fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod)**: Integrates Zod with Fastify. This allows us to share validators between runtime request checking and TypeScript static types, ensuring single source of truth for data structures.
- **[Swagger / OpenAPI](https://swagger.io/)**: (`@fastify/swagger`, `@fastify/swagger-ui`) Automatically generates interactive API documentation from our Zod schemas/routes, making it easy for frontend developers to consume the API.
- **[fastify-blipp](https://github.com/fastify/fastify-blipp)**: Prints all registered routes to the console at startup. This provides a quick overview of available endpoints during development.

### Code Quality & Standards

- **[ESLint](https://eslint.org/)**: Analyzes code to find and fix problems, ensuring consistent coding patterns.
- **[Prettier](https://prettier.io/)**: An opinionated code formatter that enforces a consistent style across the codebase.
- **[Husky](https://typicode.github.io/husky/)**: Sets up Git hooks (e.g., pre-commit) to automatically run tasks like linting and testing before code is committed.
- **[Lint-staged](https://github.com/okonet/lint-staged)**: Runs linters only on files that are staged for commit, keeping the commit process fast.
- **[Commitlint](https://commitlint.js.org/)**: Checks if commit messages meet the [Conventional Commits](https://www.conventionalcommits.org/) standard, ensuring a clean and parsable commit history.

### Development Utilities

- **[Nodemon](https://nodemon.io/)**: Automatically restarts the server when file changes are detected.
- **[ts-node](https://typestrong.org/ts-node/)**: Executes TypeScript files directly without pre-compilation, speeding up the development loop.
- **[dotenv](https://github.com/motdotla/dotenv)**: Loads environment variables from a `.env` file into `process.env`.

### Configuration Files

- **.nvmrc**: Specifies the exact Node.js version (v20.17.0) required for this project. This ensures consistency across all development environments and CI/CD pipelines.
- **.npmrc**: Configures npm behavior for reliability:
  - `save-exact=true`: Pins dependencies to exact versions relative to `package.json` (no `^` or `~`), preventing accidental breaking changes from automatic patch updates.
  - `engine-strict=true`: Enforces the Node.js version requirements defined in `package.json`.
