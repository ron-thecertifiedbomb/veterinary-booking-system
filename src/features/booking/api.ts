import { API } from "@/utils/config/api";

export type Slot = {
  time: string;
  available: boolean;
};

export const getSlots = async (date: string): Promise<Slot[]> => {
  try {
    const res = await fetch(`${API}/appointments/slots?date=${date}`);

    if (!res.ok) {
      throw new Error("Failed to fetch slots");
    }

    return await res.json();
  } catch (error) {
    throw new Error("Error loading slots");
  }
};

export const createBooking = async (payload: {
  ownerName: string;
  petName: string;
  serviceType: string;
  date: string;
  time: string;
}) => {
  try {
    const res = await fetch(`${API}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Booking failed");
    }

    return await res.json();
  } catch (error) {
    throw new Error("Error creating booking");
  }
};
