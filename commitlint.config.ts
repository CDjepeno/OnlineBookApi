import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test']],
    'subject-case': [0], // Désactive la vérification de la casse
    'header-max-length': [2, 'always', 100], // Limite la longueur max
    'subject-empty': [0], // Désactive la vérification des messages vides car on utilise notre propre parser
    'type-empty': [0],    // Désactive la vérification de type vide car on utilise notre propre parser
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(feat|fix|chore|docs|style|refactor|test):\s+(:.*?:)\s+(ON-\d+)\s+(.+)$/,
      headerCorrespondence: ['type', 'emoji', 'ticket', 'subject'],
    },
  },
};

export default config;
