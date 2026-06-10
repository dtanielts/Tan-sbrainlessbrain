# Tan's Brainless Brain - Restored React/Vite Version

This version restores the Google AI Studio React/Vite app using the files that
were sent later:

- `src/App.tsx`
- `src/data.ts`
- `src/types.ts`
- `src/components/AboutPanel.tsx`
- `src/components/PostDetail.tsx`
- `src/components/WritePostModal.tsx`
- `src/index.css`
- `src/main.tsx`

It keeps the original black/white editorial style, bilingual VI/EN toggle,
Home/About tabs, post detail view, write-post modal, and localStorage behavior.

## Important

Do not use VS Code **Go Live** for this version.

This is a React/Vite/TypeScript project, so run it with the VS Code terminal.

## Run Locally

1. Open this folder in VS Code.
2. Open the VS Code terminal.
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL Vite prints, usually:

```text
http://localhost:3000
```

## Verified

Cindy verified this version with:

```bash
npm install
npm run lint
npm run build
```

Both lint and build passed.
