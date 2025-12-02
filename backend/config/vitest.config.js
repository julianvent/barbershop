import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "backend-tests",
    environment: "node",
    exclude: [
      "node_modules/**",
      "dist/**",
      "build/**",
    ],
  },
});
