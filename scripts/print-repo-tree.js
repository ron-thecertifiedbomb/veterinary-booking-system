#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

// folders to ignore
const IGNORE = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".expo",
  ".next",
  "coverage",
  "assets",
  "android",
  ".vscode",
  ".idea",
  ".github",
  ".claude",
  "scripts",
  ".gitignore",
  "AGENTS.md",
  "CLAUDE.md",
  "DEVELOPMENT_CYCLE.md",
  "TESTING.md",
];

const PATH = ["src"];

// limit depth (VERY IMPORTANT)
const MAX_DEPTH = 3;

function printTree(dir, prefix = "", depth = 0) {
  if (depth > MAX_DEPTH) return;

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !IGNORE.includes(entry.name))
    .sort((a, b) => {
      // folders first
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    const entryPath = path.join(dir, entry.name);

    console.log(prefix + pointer + entry.name);

    if (entry.isDirectory()) {
      const extension = isLast ? "    " : "│   ";
      printTree(entryPath, prefix + extension, depth + 1);
    }
  });
}

// run
printTree(process.cwd());
