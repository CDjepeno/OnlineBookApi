export async function convertImageUrlToBlob(imageUrl: string): Promise<Blob | null> {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement de l\'image');
    }

    // Convertir la réponse en Blob
    const blob = await response.blob();
    
    return blob; // Retourner le Blob directement
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}
