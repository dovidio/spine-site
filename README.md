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

Cloudflare Pages, direct upload:

```sh
npx wrangler@latest pages deploy . --project-name spine-site --branch main
```

First time only, if the project does not exist yet:

```sh
npx wrangler@latest pages project create spine-site --production-branch main
```

Then in the Cloudflare dashboard → Pages → `spine-site` → Custom domains → add
`spine.dovguitar.com`. The zone is already on Cloudflare, so it creates the CNAME itself;
`dovguitar.com` itself is untouched.

## Or: connect the repository

Pages → Create → Connect to Git → pick this repo → framework preset "None", build command
empty, output directory `/`. Every push to `main` then deploys.

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
