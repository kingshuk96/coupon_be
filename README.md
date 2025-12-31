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

## 📋 Implementation Details

### Implemented Cases

We have successfully implemented a flexible coupon system supporting the following types:

1.  **Cart-wise Coupons:**
    - **Logic:** Applies a discount if the total value of items in the cart exceeds a specified threshold.
    - **Discount Types:** Supports both fixed amount (`AMOUNT`) and percentage-based (`PERCENTAGE`) discounts.
    - **Example:** "Get 10% off on orders above $100".

2.  **Product-wise Coupons:**
    - **Logic:** Applies a discount to specific products identified by their `productId`.
    - **Discount Types:** Supports percentage off the item's total line price or a fixed amount off.
    - **Example:** "Get $50 off on the Super Widget".

3.  **BxGy (Buy X Get Y) Coupons:**
    - **Logic:** "Buy a certain quantity of X products, Get a certain quantity of Y products for free."
    - **Features:**
      - **Repetition Limit:** Limits how many times the offer can be applied per cart (e.g., "Max 3 sets").
      - **Flexible Arrays:** Can define multiple valid "Buy" product IDs and multiple valid "Get" product IDs.
    - **Example:** "Buy 2 from [Item A, Item B] Get 1 from [Item C] Free".

4.  **Applicable Coupons API (`POST /applicable-coupons`):**
    - Scans the user's cart.
    - Filters out expired coupons.
    - Calculates the potential savings for every active coupon in the database.
    - Returns a list of all coupons that _can_ be applied, along with the specific discount amount they would provide.

5.  **Apply Coupon API (`POST /apply-coupon/:id`):**
    - Validates the specific coupon ID against the cart.
    - Checks for expiry.
    - Returns the cart with the discount applied to the total price and/or individual line items.

### Unimplemented Cases & Future Improvements

1.  **Tiered Cart Discounts:**
    - **Description:** Coupons that change value based on spend tiers (e.g., "10% > $100, 20% > $200").
    - **Reason:** Currently requires creating multiple distinct coupons with different thresholds.

2.  **User-specific Limits:**
    - **Description:** "Limit 1 use per customer".
    - **Reason:** The current schema handles global `usageLimit` but lacks a user/customer entity and tracking table to enforce per-user limits.

3.  **Category-based Discounts:**
    - **Description:** "10% off all Electronics".
    - **Reason:** The system currently relies on explicit `productId` and does not have visibility into product categories or metadata.

4.  **Complex BxGy Logic:**
    - **Description:** "Buy A AND B to get C".
    - **Reason:** The current implementation mimics "Buy from Pool A, Get from Pool B". Strict AND conditions for mixed bundles are not supported.

### Limitations

- **No User Context:** The system is stateless regarding users; it processes carts based purely on the payload provided.
- **Sequential Stacking:** The system does not currently support applying multiple coupons to a single cart (stacking). It applies one selected coupon.
- **Currency Agnostic:** Assumes all monetary values in the Cart and Coupon definitions share the same currency.

### Assumptions

- **Valid Inputs:** It is assumed that the `productId` and `price` fields provided in the Cart payload are valid and verified by the client/frontend before calling these APIs.
- **Usage Decrement:** The actual decrement of the global `usageLimit` is assumed to occur at the "Place Order" stage (not implemented here), rather than at the "Apply Coupon" (cart calculation) stage.
