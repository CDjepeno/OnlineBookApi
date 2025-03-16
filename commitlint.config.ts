import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "docs", "style", "refactor", "test"],
    ],
    "subject-case": [0], // Désactive la vérification de la casse
    "header-max-length": [2, "always", 100], // Limite la longueur max
    "subject-empty": [2, "never"], // Interdit les messages vides
  },
  parserPreset: {
    //fdsf
    parserOpts: {
      headerPattern:
        /^(feat|fix|chore|docs|style|refactor|test): (\:sparkles:|\:hammer:|\:bug:) (ON-\d{3,}) (.+)$/,
      headerCorrespondence: ["type", "emoji", "ticket", "subject"],
    },
  },
};

export default config;
