
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback } from "react";
import { DashboardStatsData, getStaffDashBoardMetricsApi } from "../services/getStaffDashBoardMetrics.api";

export function useGetStaffDashBoardMetrics() {

  const { token } = useAuth();
  const [metrics, setMetrics] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(false);
  

  const fetchMetrics = useCallback(async () => {
    
    if (!token) {
      logger.warn("fetchMetrics called without an authentication token");
      return;
    }
    try {
      setLoading(true);
      
      const response = await getStaffDashBoardMetricsApi(token);
      if (response) {
        const resData = (response as any).data;
          const metrics = resData || response;
          setMetrics(metrics);
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
  };
}
