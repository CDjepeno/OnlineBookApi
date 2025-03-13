import { ErrorsMessagesEnum } from "src/enums/errors.enums";
import { QueryFailedError } from "typeorm";

export function handleDatabaseError(error: unknown): never {
    if (error instanceof QueryFailedError && error.driverError) {
      switch (error.driverError.code) {
        case 'ER_DUP_ENTRY': // Erreur de duplication (email déjà utilisé)
          throw new Error(ErrorsMessagesEnum.DUPLICATE_EMAIL);
        case 'ER_BAD_NULL_ERROR': // Un champ NOT NULL est vide
          throw new Error(ErrorsMessagesEnum.MISSING_REQUIRED_FIELD);
        case 'ER_DATA_TOO_LONG': // Dépassement de la taille max d'une colonne
          throw new Error(ErrorsMessagesEnum.DATA_TOO_LONG);
        case 'ER_NO_REFERENCED_ROW_2': // Violation de clé étrangère
          throw new Error(ErrorsMessagesEnum.FOREIGN_KEY_CONSTRAINT);
        case 'ER_TRUNCATED_WRONG_VALUE': // Erreur de type de données
          throw new Error(ErrorsMessagesEnum.INVALID_DATA_TYPE);
        default:
          throw new Error(ErrorsMessagesEnum.DATABASE_ERROR);
      }
    }
    throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
  }