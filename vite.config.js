import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'pages/services.html'),
        profile: resolve(__dirname, 'pages/profile.html'),
        serviceDetails: resolve(__dirname, 'pages/service-details.html'),
        about: resolve(__dirname, 'pages/about.html'),
        contact: resolve(__dirname, 'pages/contact.html'),
        login: resolve(__dirname, 'pages/login.html'),
      }
    }
  }
});
