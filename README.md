# Hello!

🚧 This service is still an in-progress experiment with SvelteKit 1.0. Please expect lots of design and code flaws 🚧

Welcome to Moon Watching, a website that visualizes the current moon phase and lets folks sign up for email updates on the New and Full Moon.

The main website is built with [SvelteKit](https://kit.svelte.dev/). Other relevant details:

- Subscriber info, moon data, and images are currently stored in a cloud-hosted Postgres instance provided by [Supabase](https://supabase.com/)
- HTML emails are compiled using [Mailing](https://www.mailing.run/) (which is hosted in the separate [moonwatching-emails](https://github.com/tinykite/moonwatching-emails) codebase)
- Emails are sent with [Postmark](https://postmarkapp.com/)
- [Netlify scheduled functions](https://docs.netlify.com/functions/scheduled-functions/) are used to run a chron job once a day to check the current moon phase.

## Notes

- Netlify offers an email integration that supports Postmark and MJML templates, which I initially considered might be a more lightweight solution than the moonwatching-emails service. However, there was a [known bug](https://github.com/sveltejs/kit/issues/8903) that prevented the integration from working with SvelteKit. Additionally, templates couldn't be split into resharable, atomic components. For these reasons, a separate mailing service renders the emails.

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
