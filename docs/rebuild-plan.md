# AstrologyBlogApp Rebuild Plan

## Goal

Rebuild the application as a locally runnable, production-ready foundation without depending on the former client's Firebase, MongoDB, Google OAuth, GitHub OAuth, or hosting accounts. The current client-facing visual identity and content may remain in the frontend.

## Target architecture

- Current stable Next.js with TypeScript.
- PostgreSQL for relational application data.
- Docker Compose for the local PostgreSQL and S3-compatible MinIO services.
- Better Auth with a local administrator account, role-based access control, and secure cookie sessions.
- Optional new Google sign-in, owned by the developer, only after the core local auth works. GitHub sign-in will not be carried forward.
- MinIO locally and Cloudflare R2 in a future production environment, behind one object-storage interface.

## Delivery order

1. Create this written baseline and preserve the original code for comparison.
2. Upgrade the project foundation: package manager, TypeScript, linting, formatting, tests, environment examples, and Docker services.
3. Replace MongoDB, Prisma's old schema, Firebase, and legacy authentication with a fresh PostgreSQL data model and local auth.
4. Rebuild public blog reads and protected admin content management with validated server-side APIs.
5. Add safe media uploads, sanitised rich text, authorization, rate limiting, and error handling.
6. Test local user journeys, build a production bundle, and document deployment handoff requirements.
7. Refresh the frontend while retaining the approved client-facing identity and content.

## Change-report format

Each implementation checkpoint is reported as:

1. Previous problem.
2. Files and code changed.
3. Why the replacement is safer or more maintainable.
4. How it was verified.

## Constraints

- No former client secrets, database URLs, OAuth clients, Firebase projects, storage buckets, or hosting accounts may be used.
- Use `src/lib/auth-cli.ts` for Better Auth's schema/admin CLI commands; the runtime auth module intentionally uses Next.js `server-only` protection.
- Existing customer-facing names, images, links, prices, and copy may remain until the frontend refresh explicitly changes them.
- No production deployment or third-party account creation happens without explicit approval.
