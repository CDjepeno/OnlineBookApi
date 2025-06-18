export enum ErrorMessageEnum {
  // Messages d'erreur HTTP génériques
  BAD_REQUEST = "Requête invalide. Veuillez vérifier vos données.",
  UNAUTHORIZED = "Vous devez être connecté pour effectuer cette action.",
  FORBIDDEN = "Accès refusé. Vous n’avez pas les droits.",
  NOT_FOUND = "La ressource demandée est introuvable.",
  CONFLICT = "Conflit : Cette action ne peut pas être effectuée en raison d'un état actuel.",
  UNPROCESSABLE_ENTITY = "Impossible de traiter votre demande. Veuillez vérifier les champs.",
  INTERNAL_SERVER_ERROR = "Oups ! Notre serveur ne répond pas pour le moment. Veuillez réessayer plus tard.",
  SERVICE_UNAVAILABLE = "Le service est temporairement indisponible. Veuillez réessayer plus tard.",
  UNKNOWN_ERROR = "Une erreur inattendue s’est produite.",
}
