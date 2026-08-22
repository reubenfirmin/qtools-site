import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  define: {
    'import.meta.env.VITE_SCREENSHOT_VERSION': JSON.stringify(process.env.GITHUB_SHA ?? Date.now().toString())
  }
});
