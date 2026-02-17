# The Redds (React + TypeScript)

Minimal static blog homepage inspired by a clean, centered editorial layout.

## Stack
- Vite
- React
- TypeScript
- React Router (`HashRouter`) for GitHub Pages-safe routing

## Folder Structure
```text
.
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- public/
|   |-- .nojekyll
|   `-- CNAME
|-- src/
|   |-- components/
|   |   `-- SiteHeader.tsx
|   |-- data/
|   |   `-- posts.ts
|   |-- pages/
|   |   |-- ArchivesPage.tsx
|   |   |-- HomePage.tsx
|   |   |-- NotFoundPage.tsx
|   |   `-- PostPage.tsx
|   |-- App.tsx
|   |-- main.tsx
|   |-- styles.css
|   `-- types.ts
|-- .gitignore
|-- index.html
|-- package.json
|-- tsconfig.json
|-- tsconfig.node.json
`-- vite.config.ts
```

## Install
```bash
npm install
```

## Run Locally
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to GitHub Pages
1. Push the repo to GitHub.
2. Open `Settings -> Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main`.
5. Workflow file `.github/workflows/deploy.yml` builds and deploys automatically.

## Base Path (Important)
For the custom domain `https://theredds.eu`, keep Vite base as:

```ts
base: "/";
```

Only use a repo base path (for example `/my-repo/`) if you deploy without a custom domain at `https://<user>.github.io/<repo>/`.

## Routes
- Home: `/#/`
- Post: `/#/posts/:slug`

`HashRouter` avoids 404 refresh issues on GitHub Pages.

## Content
All post content is local/static in `src/data/posts.ts`.

The first post is `redds-statuten` and includes blog-style text plus a direct link to `Redds Statuten.pdf`.
