# Implementation Plan: User Greeting UI & Backend Integration

## Context
Port Figma-exported React components from `User greeting (1)` folder into the Next.js `farmer-web` application, integrating with real Supabase backend data. The existing dashboard in `apps/farmer-web/src/app/dashboard/` is a placeholder with hardcoded values. We will replace it with the Figma-designed UI while preserving the existing app shell (Sidebar, TopBar) and authentication patterns.

## Key Findings

### Existing Architecture
- **Route Structure**: Dashboard is at `apps/farmer-web/src/app/dashboard/page.tsx` wrapped by `dashboard/layout.tsx`
- **App Shell**: Uses `Sidebar` & `TopBar` components from `components/farmer/` - already styled with the brand colors (#2D6A4F, #EAF5EE, #FDFBF5)
- **Authentication**: Supabase auth via OTP flow (`apps/farmer-web/src/app/farmer/page.tsx`), `supabase.ts` provides client
- **API Layer**: `services/api.ts` exports `farmerApi` with `getStatus()` and `getQueuePosition()` methods for backend endpoints `/farmers/:id/status` and `/farmers/:id/queue`
- **Types**: `@kisancall/shared-types` package provides `FarmerStatusResponse` type definition
- **Assets**: Figma export uses `@/imports/` alias for local images, Unsplash URLs for hero images

### Open Questions (to be confirmed)
1. **Farmer ID Source**: Current farmer page has OTP login that sets `dummyFarmerId = '00000000-0000-0000-0000-000000000001'` for preview. The real auth flow needs to extract farmer ID from session/user. Will hardcode a test farmer ID for local testing.
2. **Assets**: Need to copy `image-1.png` through `image-22.png` from `User greeting (1)/src/imports/` to `apps/farmer-web/public/imports/` for proper image serving.

## Implementation Approach

### Phase 1: Layout & Dashboard (Current Focus)

**Step 1: Copy Local Assets**
- Copy all `image-*.png` files from `User greeting (1)/src/imports/` to `apps/farmer-web/public/imports/`
- Keep Unsplash URLs in code (they're CDN-hosted, no need to download)

**Step 2: Update Dashboard Page**
Replace `apps/farmer-web/src/app/dashboard/page.tsx` with the Figma App.tsx content, modified for Next.js:

- Use existing `TopBar` component instead of inline header
- Use existing `Sidebar` (already passed via layout, so use `usePathname` to detect active screen)
- Integrate real API data fetching via `farmerApi.getStatus()`
- Add auth context hook to get farmer ID from Supabase session

**Step 3: Add Global Animation Styles**
Add keyframe animations (soundWave, glow-pulse, float, shimmer) to `globals.css` that are used by the Figma UI.

**Step 4: Create Farmer Context (if needed)**
Create a context/provider to manage farmer auth state across pages, extracting farmer ID from Supabase session.

**Files to Create/Modify:**
- `apps/farmer-web/public/imports/` — copy 20+ image files
- `apps/farmer-web/src/app/dashboard/page.tsx` — major rewrite with real data
- `apps/farmer-web/src/app/dashboard/layout.tsx` — may need adjustment for pathname detection
- `apps/farmer-web/src/lib/farmer-context.tsx` — new context for farmer auth
- `apps/farmer-web/src/lib/farmerApi.ts` — may need to add getter for current farmer ID

### Verification Plan
1. `pnpm install` (already have dependencies from shared-types)
2. `pnpm run dev` in `apps/farmer-web`
3. Navigate to `http://localhost:3001/dashboard` (port from package.json)
4. Verify:
   - Sidebar renders with correct active state
   - TopBar shows farmer name from API
   - Hero banner displays with blurred photo
   - Queue Status card shows real position from API
   - Progress ring updates dynamically
   - All cards display backend data

## Dependencies Already in Place
- `lucide-react` ✓ (icons used in Figma export)
- `tailwindcss` ✓ (existing styles)
- `@kisancall/shared-types` ✓ (FarmerStatusResponse type)

## Notes
- No git pushes will be made
- Testing will be done locally
- Once Phase 1 is approved locally, proceed to Phase 2 (Mandi Prices)