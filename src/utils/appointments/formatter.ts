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


/**
 * Formats an ISO string date into a human-readable appointment schedule string.
 * @param isoString - The string date representation (e.g., "2026-06-16T02:00:00.000Z")
 * @returns Formatted label string (e.g., "June 16, 2026 Appointment Schedule")
 */
export function formatAppointmentSchedule(isoString: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Fallback check for invalid date formats passed into the function
  if (isNaN(date.getTime())) {
    return "Invalid Date Schedule";
  }

  // Define months manually to avoid environment/locale variations across systems
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthName = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${monthName} ${day}, ${year}`;
}


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
