export const formatRelativeTime = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} sec`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} d`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} mo`;

  return `${Math.floor(seconds / 31536000)} yr`;
};

export const formattedDate = (created: string | null | undefined) =>
    created
      ? new Date(created).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "Unknown";
