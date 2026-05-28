export const formatPHDate = (input: Date | string) => {
  if (!input) return ""; // ✅ prevent undefined/null

  const date = new Date(input);

  if (isNaN(date.getTime())) return "Invalid date"; // ✅ guard

  const time = date.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  });

  return `Time: ${time}`;
};
;
