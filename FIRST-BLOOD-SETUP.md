# First Blood deployment setup

1. In Supabase, open **SQL Editor**, paste `supabase/first-blood.sql`, and run it once.
2. In Netlify, add these environment variables:
   - `SUPABASE_URL` — existing Supabase project URL
   - `SUPABASE_SERVICE_KEY` — existing Supabase service-role key
   - `FIRST_BLOOD_UPLOAD_TOKEN` — use the value Alex sends privately (never commit it to this repository)
3. Deploy this repository through Netlify normally.
4. Verify `https://hollowpoints.gg/first-blood` opens.
5. Put the same token into each recorder's `recorder.config.json`.

The upload endpoint is `https://hollowpoints.gg/api/upload/matches`. Match IDs are primary keys, so uploads from multiple recorders do not create duplicate games.
