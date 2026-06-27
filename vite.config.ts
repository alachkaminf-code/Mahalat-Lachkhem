import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), tailwindcss()];
  if (mode !== 'production') {
    try {
      // @ts-expect-error - .vite-source-tags.js is a dev-only, untyped local plugin file
      const m = await import('./.vite-source-tags.js');
      plugins.push(m.sourceTags());
    } catch (err) {
      console.warn('[vite.config] optional dev plugin .vite-source-tags.js not loaded:', err);
    }
  }

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
  };
})
