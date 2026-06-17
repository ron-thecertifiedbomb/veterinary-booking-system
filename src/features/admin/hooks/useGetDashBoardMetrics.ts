
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback } from "react";
import { getGetDashBoardMetricsApi } from "../services/getDashBoardMetrics.api";
import { DashboardMetricsData } from "../types/admin.types";



export function useGetDashBoardMetrics() {

  const { token } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetricsData | null>(null);
  const [serverTime, setServerTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  

  const fetchMetrics = useCallback(async () => {
    
    if (!token) {
      logger.warn("fetchMetrics called without an authentication token");
      return;
    }
    try {
      setLoading(true);
      const response = await getGetDashBoardMetricsApi(token);
      if (response) {
        const severTime = (response.serverTime.local)
        const resData = (response as any).data;
          const metrics = resData || response;
          setMetrics(metrics);
          setServerTime(severTime)
      }
    } catch (err: any) {
      logger.error("Fetching metrics failed", err);
    } finally {
      setLoading(false);
    }
  }, [token]);
  

  return {
    fetchMetrics,
    metrics,
    loading,
    serverTime
  };
}
