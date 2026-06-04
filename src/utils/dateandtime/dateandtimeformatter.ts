// ..\src\utils\dateandtime\dateandtimeformatter.ts

export const formatDateTime = (iso?: string) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
