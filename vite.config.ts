// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from 'vite-plugin-svgr';


function addCoopHeader() {
  return {
    name: "vite-plugin-add-coop-header",
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(), 
    addCoopHeader(),
    svgr(),
  ],
  base: "/Arausports/",
});
