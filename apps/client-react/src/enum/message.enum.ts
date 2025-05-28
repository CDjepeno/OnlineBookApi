export enum SuccessMessageEnum {
  BOOK_CREATE_SUCCESS = "Le livre a été créé avec succès",
  BOOK_UPDATE_SUCCESS = "Le livre a été mis à jour avec succès",
  BOOK_DELETE_SUCCESS = "Le livre a été supprimé avec succès",
}

export enum ErrorMessageEnum {
  // Messages d'erreur spécifiques aux livres
  BOOK_CREATE_ERROR = "Une erreur est survenue lors de la création du livre",
  BOOK_UPDATE_ERROR = "Une erreur est survenue lors de la mise à jour du livre",
  BOOK_DELETE_ERROR = "Une erreur est survenue lors de la suppression du livre",
  BOOK_ID_REQUIRED = "L'ID du livre est requis",
  INVALID_BOOK_ID = "L'ID du livre fourni n'est pas valide",

  // Messages d'erreur spécifiques aux utilisateurs
  USER_ID_REQUIRED = "L'ID utilisateur est requis pour récupérer les livres",
  INVALID_USER_ID = "L'ID utilisateur fourni n'est pas valide",

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
