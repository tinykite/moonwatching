# Hello!

Welcome to Moon Watching, a website that visualizes the current moon phase and lets folks sign up for email updates on the New and Full Moon.

The main website is built with SvelteKit. Other relevant details:

- Subscriber info, moon data, and images are currently stored in a cloud-hosted Postgres instance provided by Supabase
- HTML emails are compiled using Mailing (which is hosted in the separated moonwatching emails codebase)
- Emails are sent with Postmark
- Netlify scheduled functions are used to run a chron job once a day to check the current moon phase.

## Notes

- The Netlify scheduled function is currently in-progress, while I figure out the best way to securely call a SvelteKit POST endpoint.
- The website currently accepts newsletter signups, but the submission of the signup form is rather slow at best. This is a high-priority issue that will also be fixed.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of this app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
