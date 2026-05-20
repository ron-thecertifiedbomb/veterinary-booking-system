export const formatDate = (date: string) => {
  const parsed = new Date(date);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};



export const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString("en-CA");
};

