import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "docs", "style", "refactor", "test"],
    ],
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
    "subject-empty": [0],
    "type-empty": [0],
  },
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^(feat|fix|chore|docs|style|refactor|test) (\:sparkles:|\:hammer:|\:bug) (ON-\d{3,}) (.+)$/,
      headerCorrespondence: ["type", "emoji", "ticket", "subject"],
    },
  },
};

export default config;
