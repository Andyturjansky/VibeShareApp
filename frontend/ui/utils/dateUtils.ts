export const formatDate = (date: string): string => {
  const now = new Date();
  const [year, month, day] = date.split('-').map(Number);
  const postDate = new Date(year, month - 1, day);

  const isCurrentYear = now.getFullYear() === postDate.getFullYear();

  return postDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    ...(isCurrentYear ? {} : { year: 'numeric' })
  });
};
