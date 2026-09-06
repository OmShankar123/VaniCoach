#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const arg = (process.argv[2] || "development").toLowerCase();

const aliasMap = {
  dev: "development",
  development: "development",
  stage: "staging",
  staging: "staging",
  prod: "production",
  production: "production",
};

const targetEnv = aliasMap[arg];

if (!targetEnv) {
  console.error("\x1b[31m[ERROR] Unknown environment: \x1b[1m" + arg + "\x1b[0m");
  console.log("Usage: node scripts/set-env.js [development | staging | production]");
  process.exit(1);
}

const sourceFile = path.join(rootDir, `.env.${targetEnv}`);
const targetFile = path.join(rootDir, ".env");

if (!fs.existsSync(sourceFile)) {
  console.error(`\x1b[31m[ERROR] Source file ${sourceFile} does not exist!\x1b[0m`);
  process.exit(1);
}

try {
  fs.copyFileSync(sourceFile, targetFile);
  const content = fs.readFileSync(targetFile, "utf8");

  const lines = content.split("\n");
  const parsed = {};
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [k, ...v] = trimmed.split("=");
      parsed[k] = v.join("=");
    }
  });

  console.log("\n\x1b[32m====================================================\x1b[0m");
  console.log(`\x1b[32m✔ Active Environment Switched to: \x1b[1m${targetEnv.toUpperCase()}\x1b[0m`);
  console.log("\x1b[32m====================================================\x1b[0m");
  console.log(`  • API URL       : \x1b[36m${parsed.EXPO_PUBLIC_API_URL || "default"}\x1b[0m`);
  console.log(`  • AI Model      : \x1b[36m${parsed.EXPO_PUBLIC_AI_EVALUATION_MODEL || "default"}\x1b[0m`);
  console.log(`  • Debug Stats   : \x1b[36m${parsed.EXPO_PUBLIC_ENABLE_DEBUG_STATS || "false"}\x1b[0m`);
  console.log(`  • Target File   : .env (from .env.${targetEnv})\n`);
} catch (err) {
  console.error("\x1b[31m[ERROR] Failed to switch environment:\x1b[0m", err);
  process.exit(1);
}
