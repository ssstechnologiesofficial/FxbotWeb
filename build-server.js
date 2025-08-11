#!/usr/bin/env node

// Build script for server files
import fs from "fs";
import path from "path";

const serverSrc = "server";
const serverDist = "dist/server";

// Create dist directory
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

if (!fs.existsSync(serverDist)) {
  fs.mkdirSync(serverDist, { recursive: true });
}

// Copy server files
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(serverSrc, serverDist);
console.log("✅ Server files built successfully");
