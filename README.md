# Birthday Invitation

A strawberry-pink React invitation with a Laravel API for saving guest RSVPs
to SQLite.

## Run locally

In one terminal, start the Laravel API:

```powershell
cd backend
php artisan migrate
php artisan serve
```

In a second terminal, start the React app from the project root:

```powershell
npm install
npm run dev
```

Open the Vite URL printed in the terminal. The Vite development server proxies
`/api` requests to Laravel at `http://127.0.0.1:8000`.

## Personalize the invitation

- Update the name, age, date, time, venue, address, and note in
  `src/invitation.js`. The party time is currently marked as to be announced.
- Add the birthday photo to `public/birthday-photo.jpg` and set
  `photo: "/birthday-photo.jpg"` in `src/invitation.js`. The on-page photo button
  previews a photo in the current browser only; use the public file for a photo
  that all invitees should see.
- Guest names and attendance choices are stored in
  `backend/database/database.sqlite`. The public API only accepts RSVPs; it
  does not expose the guest list.

## Verify

```powershell
npm run build
cd backend
php artisan test
```
