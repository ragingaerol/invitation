# Birthday Invitation

A strawberry-pink React invitation with a Supabase backend for saving and
viewing guest RSVPs.

## Set up Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).
   This creates the RSVP table and allows anyone with the public page to submit
   and view RSVP names and attendance responses.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key
   from the Supabase project API settings. The anon key is intended for browser
   use; never put a service-role key in the frontend.

## Run locally

From the project root:

```powershell
npm install
npm run dev
```

Open the Vite URL printed in the terminal. The invitation is at `/` and the
public RSVP dashboard is at `/dashboard`.

## Personalize the invitation

- Update the name, age, date, time, venue, address, and note in
  `src/invitation.js`.
- Xienna's extracted portrait is in `public/xienna.png` and is shown on the
  invitation. Replace that public image (and update `photo` in
  `src/invitation.js` if you use a different filename) to change it for all
  invitees. The on-page photo button only previews a replacement in the current
  browser.
- Guest names and attendance choices are stored in the Supabase `rsvps` table.
- The dashboard is public: anyone with its URL can view RSVP names and
  attendance responses.
- RSVPs already stored in the old Laravel SQLite database are not copied to
  Supabase automatically.

## Verify

```powershell
npm run build
```
