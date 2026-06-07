// src/env.js
const isDev = process.env.NODE_ENV === "development";

const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
};

if (isDev) {
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      console.warn(`⚠️  Missing env var: ${key}`);
    }
  }
}

export const env = {
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  isDev,
};
