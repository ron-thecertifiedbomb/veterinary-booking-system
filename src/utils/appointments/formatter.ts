// ..\src\utils\dateandtime\formatter.ts

export const formatBookingCode = (code: string | undefined): string => {
  if (!code) return "";
  return code.substring(0, 5).toUpperCase();
};

export const formatSlotTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const h = Number(hour);

  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;

  return `${formattedHour}:${minute} ${ampm}`;
};

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
   
    today: date.toLocaleDateString("en-PH", {
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


export const formatter = (time: string) => {
  return time
    .replace(/:\d{2}\s/, " ") 
    .replace(/\s?(AM|PM)/i, "") 
    .trim();
};



// ✅ always PH-safe YYYY-MM-DD
export const getTodayDate = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Manila",
  });
};


// ✅ display date (NO SHIFT, PH-safe)
export const formatDate = (date: string) => {
  // ✅ If already "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);

    // Create LOCAL date (no UTC conversion)
    const localDate = new Date(year, month - 1, day);

    return localDate.toLocaleDateString("en-US", {
      timeZone: "Asia/Manila",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // ✅ fallback for ISO strings
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// ✅ display time (safe)

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatShortDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};


export function formatAppointmentDate(date: string, time: string) {
  return `${date}T${time}:00+08:00`;
}



export const todayStr = new Date().toISOString().split("T")[0];



/**
 * Converts a date string into a readable format like "June 16, 2026".
 * Handles null or undefined values by returning a placeholder string.
 */
export const formatReadableDate = (dateString?: string | null): string => {
  if (!dateString) return "Select Date";
  
  const date = new Date(dateString);
  
  // Check if the date conversion is valid
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};




/**
 * Formats an ISO string into a clean date layout.
 * @example "2026-06-17T01:00:00.000Z" -> "June 17, 2026"
 */
export const formatAppointmentDateOnly = (dateString?: string | null): string => {
  if (!dateString) return "No Date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * Formats an ISO string into a clean 12-hour time layout without leading zeros.
 * @example "2026-06-17T01:00:00.000Z" -> "1:00 AM" (No leading zero)
 */
export const formatAppointmentTimeOnly = (dateString?: string | null): string => {
  if (!dateString) return "No Time";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric", // FIX: Changed from "2-digit" to remove leading zeros natively
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

/**
 * Combines both formatters to return a unified string.
 * @example "2026-06-17T01:00:00.000Z" -> "June 17, 2026 at 1:00 AM"
 */
export const formatAppointmentSchedule = (dateString?: string | null): string => {
  if (!dateString) return "Not Scheduled";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Not Scheduled";

  const datePart = formatAppointmentDateOnly(dateString);
  const timePart = formatAppointmentTimeOnly(dateString);

  return `${datePart} at ${timePart}`;
};