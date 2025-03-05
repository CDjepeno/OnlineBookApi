export const truncateDescription = (description: string, limit: number) => {
  return description.length > limit
    ? description.substring(0, limit) + "..."
    : description;
};