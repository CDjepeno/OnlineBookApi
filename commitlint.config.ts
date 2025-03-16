import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "docs", "style", "refactor", "test"],
    ],
    "subject-case": [0], // disable subject case
    "header-max-length": [2, "always", 100],
    "subject-empty": [0],
    "type-empty": [0],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(feat|fix|chore|docs|style|refactor|test):\s+(:.*?:)\s+(ON-\d+)\s+(.+)$/,
      headerCorrespondence: ["type", "emoji", "ticket", "subject"],
    },
  },
};

export default config;
