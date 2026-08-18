<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# RoccolAPP

Private shared web app for a couple: monthly calendar, shopping list, to-do list, and
future shared tabs. Deployed on Vercel, source on GitHub, data in Firebase (Auth +
Firestore).

## Stack
- Next.js App Router + TypeScript + Tailwind v4
- Firebase Auth (email/password, exactly two accounts — the household) for sign-in
- Firestore for data, realtime via `onSnapshot`
- Firestore security rule: any authenticated user in this project can read/write
  everything (`firestore.rules`) — there is no per-user data isolation, it's a shared
  space by design

## Structure
- `src/lib/firebase.ts` — Firebase app/auth/db init from `NEXT_PUBLIC_FIREBASE_*` env vars
- `src/lib/auth-context.tsx` — `AuthProvider` / `useAuth()`
- `src/components/AuthGate.tsx` — wraps a page, redirects to `/login` if signed out
- `src/lib/nav-items.ts` — registry of top nav tabs
- `src/components/NavTabs.tsx` — renders tabs from `nav-items.ts`
- `src/components/Calendar.tsx` — monthly grid, reads/writes the `events` collection
- `src/components/SharedList.tsx` — generic checkable list (used by spesa + todo),
  reads/writes whatever Firestore collection name is passed as a prop

## Adding a new tab
1. Create `src/app/<route>/page.tsx`. Wrap the content in `<AuthGate>`.
2. If it's a simple checkable list, reuse `<SharedList collectionName="..." .../>`.
   Otherwise build a new component under `src/components/`, following the pattern in
   `Calendar.tsx` / `SharedList.tsx` (Firestore `onSnapshot` for realtime sync).
3. Add `{ href: "/<route>", label: "...", icon: "..." }` to `NAV_ITEMS` in
   `src/lib/nav-items.ts` — it shows up in the nav bar automatically.
4. New Firestore collections work with no schema migration, but if you add new
   composite queries (multiple `where`/`orderBy`), add the matching index to
   `firestore.indexes.json` and deploy with `firebase deploy --only firestore`.

## Firebase project
- Project ID: `roccola-app` (console: https://console.firebase.google.com/project/roccola-app)
- Deploy rules/indexes: `firebase deploy --only firestore`
- The two user accounts are created manually in the Firebase Console
  (Authentication → Users) — this app has no self-serve signup by design.

