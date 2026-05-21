import { getAppointments } from "@/features/admin/apit";
import { useEffect, useState } from "react";


export const useAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.log("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    appointments,
    loading,
    refresh: load,
  };
};