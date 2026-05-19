# Talent Tracker Frontend

Internal frontend for People & Talent candidate pipeline management.

## What it includes

- Candidate list with name, position, status, and stage.
- Live filtering by status and stage.
- Live search by candidate name or email.
- Master-detail layout so detail opens without losing list context.
- Quick status and stage updates from detail view (single interaction).
- Candidate notes add/delete.
- Candidate creation and full profile editing.
- Async loading and visible success/error feedback for all API actions.

## API

Default base URL:

- `https://playground.4geeks.com/tracker/api/v1`

You can change it in the top input of the UI. The value is stored in `localStorage` as `tracker_api_base`.

## Run

From repository root:

```bash
npm run start
```

Then open:

- `http://localhost:3000/apps/talent-tracker/index.html`
