import { defineConfig } from "drizzle-kit";
import { readConfig } from "./config";

export default defineConfig({
    schema: "./schema.ts",
    out: "src/lib/db",
    dialect: "postgresql",
    dbCredentials: {
        url: readConfig().dbUrl,
    },
});