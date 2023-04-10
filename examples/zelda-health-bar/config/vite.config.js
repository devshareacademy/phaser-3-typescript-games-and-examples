import { defineConfig } from 'vite';

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
      input: {
        main: 'index.html',
        interSceneExample: 'inter-scene-communication.html',
        dependencyInjectionExample: 'simple-dependency-injection.html'
      }
    },
  },
});
