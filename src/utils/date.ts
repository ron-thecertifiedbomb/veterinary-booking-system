// ✅ always PH-safe YYYY-MM-DD
export const getTodayDate = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Manila",
  });
};

// ✅ normalize ANY input date → PH YYYY-MM-DD
export const formatPHDate = (input: Date | string) => {
  return new Date(input).toLocaleDateString("en-CA", {
    timeZone: "Asia/Manila",
  });
};

// ✅ display date (safe)
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "Asia/Manila", 
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// ✅ display time (safe)
export const formatTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);

  return date.toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila", 
    hour: "numeric",
    minute: "2-digit",
  });
};