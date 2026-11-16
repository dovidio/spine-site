# spine.dovguitar.com

The website for **Spine — iCloud Music Player**. Static: no build step, no framework,
no analytics, no third-party requests. Three pages and a stylesheet.

```
index.html        the front page
support.html      what the App Store links to as "Support URL"
privacy.html      what the App Store links to as "Privacy Policy URL"
404.html
assets/style.css
assets/fonts/     Arimo (SIL OFL) — self-hosted
assets/shots/     real captures of the running app
```

## Deploy

Live at **https://spine.dovguitar.com** (Cloudflare, static assets on Workers — the current
form of Pages). No build step; the repository root is the site.

```sh
npx wrangler@latest deploy
```

`wrangler.jsonc` names the worker and points its assets at `./`; `.assetsignore` keeps the
repository's own files out of the upload. `_headers` (CSP, caching, no-sniff) is applied by
the platform.

Custom domain: `spine.dovguitar.com` is attached as a Workers custom domain on the
`dovguitar.com` zone, which also serves the main site — the subdomain is additive.

## Pages

`/support` and `/privacy` are the canonical URLs, because the platform redirects
`*.html` to the extensionless path. The App Store listing uses those two.

## Facts

Every claim on the site is a property of the app: no upload, no server, no account, no
transcoding, user-set storage budget, tags read from the file. The screenshots are captures
of the running build (iPhone, iOS 26) with a test library; nothing is mocked up.

The type is Arimo, self-hosted under the SIL Open Font License (`assets/fonts/OFL.txt`).
The app is set in Helvetica Neue, which cannot be shipped on the web; Arimo is metrically
compatible, and the character of the world lives in the black ground, the half-point
hairlines and the one red, exactly as it does in the app.

## Licence

MIT for the code and the writing. The screenshots are of the app and are © the author.
