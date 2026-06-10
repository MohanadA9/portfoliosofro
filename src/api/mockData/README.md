# Mock Data

This folder is the **mock backend** the app talks to when
`MOCK_MODE = true` in `../request.js`.

Editable resources:

- `settings.json` — site title, hero copy, typewriter phrases, CTAs, footer.
-

The bulkier auto-generated datasets (achievements, researches, courses, blogs,
experiences, positions, messages, media, education, profile) live in
`src/data/mockData.ts` and are re-exported through `request.js` as if they
were `.json` files. Edit them there.

To go live against a real backend:

1. Set `BASE_URL` in `../endpoints.js` to your API origin.
2. Flip `MOCK_MODE` to `false` in `../request.js`.
3. (Optional) Migrate one endpoint at a time by adding its path to
   `FORCE_REAL_API_ENDPOINTS` in `request.js`.
