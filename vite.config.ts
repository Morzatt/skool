import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';
// import mkcert from "vite-plugin-mkcert"
import { readFileSync } from "fs"

export default defineConfig({
    plugins: [sveltekit()],//, mkcert()],

    test: {
        include: ['tests/**/*.{test,spec}.{js,ts}']
    },
    server: {
        https: {
            key:  readFileSync(`${__dirname}/cert/localhost-key.pem`),
            cert: readFileSync(`${__dirname}/cert/localhost.pem`)
        }
    }
});
