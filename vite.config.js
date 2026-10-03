import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Multi-page build: each page is its own HTML entry with its own CSS bundle, so the
// Soothsayer and Trade Bit design systems never share (or override) styles.
// Output: dist/index.html and dist/tt-1/index.html — served at / and /tt-1/ by any static host.
// For GitHub Pages project sites, set base to '/<repo-name>/'.

const PAGE_DIRS = ['/tt-1']

// Static hosts redirect /tt-1 → /tt-1/ themselves; Vite's dev/preview servers instead
// fall back to the home page, so mirror the host behaviour here.
function trailingSlashRedirect() {
  const middleware = (req, res, next) => {
    const [path, query = ''] = req.url.split('?')
    if (!PAGE_DIRS.includes(path)) return next()
    res.statusCode = 301
    res.setHeader('Location', `${path}/${query && `?${query}`}`)
    res.end()
  }
  return {
    name: 'trailing-slash-redirect',
    // Block bodies on purpose: a function returned from these hooks is run as a post-hook.
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig({
  plugins: [react(), trailingSlashRedirect()],
  base: '/',
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        tt1: resolve(import.meta.dirname, 'tt-1/index.html'),
      },
    },
  },
})
