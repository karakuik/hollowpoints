# First Blood deployment setup

1. In Supabase, open **SQL Editor**, paste `supabase/first-blood.sql`, and run it. The script is safe to rerun when this integration changes.
2. In Netlify, add these environment variables:
   - `SUPABASE_URL` — existing Supabase project URL
   - `SUPABASE_SERVICE_KEY` — existing server-only Supabase service key
   - `FIRST_BLOOD_ENROLLMENT_CODE` — a temporary invite code Alex gives friends when registering a PC
   - `FIRST_BLOOD_UPLOAD_TOKEN` — keep the old shared value only during migration; remove it after every PC is registered
3. Deploy this repository through Netlify normally.
4. Verify `https://hollowpoints.gg/first-blood` opens.
5. Give each friend the temporary enrollment code. In the uploader's Settings screen they name their PC, enter the code once, and receive a unique device credential automatically.
6. Rotate `FIRST_BLOOD_ENROLLMENT_CODE` after enrollment, or remove it until another PC needs to register.
7. Once all old uploaders have registered, delete `FIRST_BLOOD_UPLOAD_TOKEN` from Netlify. This disables the old shared password.

The enrollment endpoint is `https://hollowpoints.gg/api/upload/register`; the match endpoint is `https://hollowpoints.gg/api/upload/matches`. Match IDs are primary keys, so uploads from multiple recorders do not create duplicate games. Device tokens are stored only as SHA-256 hashes, can be revoked individually by setting `revoked_at`, and are rate-limited independently.

## Revoking one PC

Open Supabase's `first_blood_uploaders` table, find the PC by its `label`, and set `revoked_at` to the current date and time. Other uploaders continue working.
