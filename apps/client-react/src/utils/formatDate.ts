
export const formatDate = (dateString: string | Date ) => {
  
  const date = dateString instanceof Date ? dateString:  new Date(dateString);

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
