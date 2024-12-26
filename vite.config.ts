

// @ts-ignore
import tsConfigPaths from 'vite-tsconfig-paths'
// @ts-ignore
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins:[tsConfigPaths()],
    test: {
        globals: true
    }
})