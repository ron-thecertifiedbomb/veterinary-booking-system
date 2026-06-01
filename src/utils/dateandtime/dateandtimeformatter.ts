export const formatDateTime = (isoString: string) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    timeZone: "Asia/Manila", // ✅ FORCE PH TIME
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
