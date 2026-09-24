# Motion draft

Eleven static pages: home, shop, three flavor pages, formula, giveaway, movement, FAQ, affiliates, and wholesale.

The connected Vercel project deploys `main` from GitHub, with this folder as its root and `dist` as its output. No build step is needed. Mobile refinements live in `dist/mobile.css`, loaded after the original desktop styles. See `MOBILE-REVIEW.md` for the mobile verification record.

## Vercel preview

From this folder:

    npx vercel@60.0.0 login
    npx vercel@60.0.0 deploy --yes --scope cbarbricks-projects

The included vercel.json serves dist with clean URLs. No build or backend is required.

Checkout and giveaway entry continue on the official brand sites. Social caption overlays use explicitly labeled draft captions; replace these with approved Instagram captions before public launch. Social media provenance is recorded in asset-sources.json and giveaway-media-sources.json.
