# ARRIETA — Production deployment fix

## 1. Critical Vercel fix
`api/index.ts` imports `dist/index.js`. The build script now explicitly generates that file from `server/_core/app.ts`.

## 2. Vercel build output
Vercel is configured to use `pnpm run build` and `dist/public` as the static output directory.

## 3. Environment variables
The production environment MUST NOT use localhost for OAuth.

Required server variables:
- DATABASE_URL
- JWT_SECRET
- VITE_APP_ID
- OAUTH_SERVER_URL

Required client/build variables:
- VITE_APP_ID
- VITE_OAUTH_PORTAL_URL

`VITE_OAUTH_PORTAL_URL` and `OAUTH_SERVER_URL` in the local `.env` are currently localhost values and are not suitable for Vercel.

## 4. Database
The deployment does not run `db:push` automatically. The production database must already contain the Drizzle schema/migrations.

Do NOT run migrations against production until DATABASE_URL has been verified to point to the intended production database.

## 5. Authentication security warning
The current code contains a hardcoded `admin-auth-code` development shortcut in `server/_core/oauth.ts`. It should NOT be exposed as the real production authentication mechanism. Replace it with a real production auth provider or a properly secured server-side admin authentication flow before treating the site as production-secure.
