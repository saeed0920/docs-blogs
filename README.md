# docs

Personal notes and docs built with
[Fumadocs](https://github.com/fuma-nama/fumadocs) + Next.js.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Static build (GitHub Pages)

```bash
# local static export (no base path)
npm run build
npm start

# GitHub Pages project site: https://saeed0920.github.io/docs/
GITHUB_PAGES=true npm run build
```

Static files land in `out/`. On push to `main`, `.github/workflows/deploy.yml`
builds with `GITHUB_PAGES=true` and deploys via GitHub Actions.

Enable Pages in the repo: **Settings → Pages → Source: GitHub Actions**.

## Explore

- `lib/source.ts`: content source adapter (`loader()`)
- `lib/layout.shared.tsx`: shared layout options

| Route            | Description                          |
| ---------------- | ------------------------------------ |
| `app/(home)`     | Landing page and blog                |
| `app/lpic1`      | LPIC-1 docs                          |
| `app/front`      | Frontend docs                        |
| `app/git`        | Git docs                             |

## TODO

- [x] Static build for nextjs and GitHub Pages
- [] Front course
- [x] Signal summery month
- [] Git workshop docs
- [] Domjduge documents
- [x] Try to create blogs : Add BCPC - Charbug - or anything you want
- [] Create post in linkdin
- [x] Add in github and build with github pages
- [x] Remove the puzzley stuff
- [] make the docs order
