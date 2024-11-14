export const formatDate = (date: string): string => {
  const now = new Date();
  const postDate = new Date(date); // Interpretar la fecha directamente

  const isCurrentYear = now.getFullYear() === postDate.getFullYear();

  return postDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    ...(isCurrentYear ? {} : { year: 'numeric' })
  });
};
