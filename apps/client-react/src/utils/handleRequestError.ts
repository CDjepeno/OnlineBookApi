import axios from "axios";

export function handleRequestError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    console.error("Une erreur Axios s'est produite:", error.message);
    if (error.response) {
      console.error("Données de la réponse:", error.response.data);
      console.error("Code de statut:", error.response.status);
    }
    throw error;
  }
  if (error instanceof Error) {
    console.error("une Erreur inattendue s'est produit:", error.message);
    throw error;
  }
  console.error("Erreur inconnue:", error);
  throw new Error("Erreur inconnue.");
}
