import { getAppointmentsApi, GetAppointmentsFilters } from "@/features/appointment/services/getAppointments.api";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback, useEffect } from "react";
import { Appointment } from "@/features/admin/types/admin.types";

export type AdminDateFilter = "all" | "today" | "upcoming" | "past";

export interface UseGetAllAppointmentsProps {
  initialFilters?: Partial<GetAppointmentsFilters>;
  role?: string;
}

function getLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFilterToRange(filter: AdminDateFilter): GetAppointmentsFilters {
  const today = new Date();

  if (filter === "today") {
    const value = getLocalDateString(today);
    return { from: value, to: value };
  }

  if (filter === "upcoming") {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const farFuture = new Date(today);
    farFuture.setFullYear(farFuture.getFullYear() + 5);
    return { from: getLocalDateString(tomorrow), to: getLocalDateString(farFuture) };
  }

  if (filter === "past") {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const farPast = new Date(today);
    farPast.setFullYear(farPast.getFullYear() - 5);
    return { from: getLocalDateString(farPast), to: getLocalDateString(yesterday) };
  }

  return {};
}

function normalizeAppointments(response: unknown): Appointment[] {
  if (!response || typeof response !== "object") return [];

  const data = (response as { data?: unknown }).data;

  if (Array.isArray(data)) return data as Appointment[];
  if (data && typeof data === "object" && Array.isArray((data as { appointments?: unknown }).appointments)) {
    return (data as { appointments: Appointment[] }).appointments;
  }

  return [];
}

export function useGetAllAppointments({ initialFilters, role: customRole }: UseGetAllAppointmentsProps = {}) {
  const { token, user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<AdminDateFilter>("all");

  const [filters, setFilters] = useState<GetAppointmentsFilters>(() => ({
    sortBy: "appointmentDate",
    sortOrder: "desc",
    ...initialFilters,
  }));

  const activeRole = customRole ?? user?.role;

  const fetchAllAppointments = useCallback(async () => {
    if (!token) {
      logger.warn("fetchAppointments called without an authentication token");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getAppointmentsApi(token, filters, undefined, activeRole);
      setAppointments(normalizeAppointments(response));
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
      setError(err?.message || "Failed to fetch appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [token, filters, activeRole]);

  useEffect(() => {
    fetchAllAppointments();
  }, [fetchAllAppointments]);

  const applyDateFilter = useCallback((filter: AdminDateFilter) => {
    setDateFilter(filter);
    const range = dateFilterToRange(filter);
    setFilters((prev) => ({
      ...prev,
      from: range.from,
      to: range.to,
    }));
  }, []);

  const setCustomRange = useCallback((from?: string, to?: string) => {
    setDateFilter("all");
    setFilters((prev) => ({
      ...prev,
      from: from || undefined,
      to: to || undefined,
    }));
  }, []);

  return {
    fetchAllAppointments,
    appointments,
    loading,
    error,
    isEmpty: appointments.length === 0,
    filters,
    setFilters,
    dateFilter,
    applyDateFilter,
    setCustomRange,
  };
}
