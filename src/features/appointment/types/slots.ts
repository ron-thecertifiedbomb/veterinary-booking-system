// ..\src\features\appointment\types\slots.ts

export type Slot = {
  time: string;
  available: boolean;
  status: "available" | "full" | "past";
};

export type SlotsResponse = {
  meta: {
    currentDateTime: {
      iso: string;
      date: string;
      time: string;
    };
    timezone: string;
    date: string;
  };
  slots: Slot[];
};

export type SlotsApiResponse = {
  message: string;
  data: SlotsResponse;
};
