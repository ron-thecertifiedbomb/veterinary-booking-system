export const parseServerNow = (serverNow?: string | null) => {
  const date = serverNow ? new Date(serverNow) : new Date();

  if (isNaN(date.getTime())) {
    return {
      raw: new Date(),
      date: "",
      time: "",
    };
  }

  return {
    raw: date,
    date: date.toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};
