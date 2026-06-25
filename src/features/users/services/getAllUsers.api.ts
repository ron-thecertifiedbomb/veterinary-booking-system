import { api } from "@/utils/api/api.client";
import { logger } from "@/utils/logger/logger";
import { GetAllUsersResponse, UserRole } from "../types/types";

type SortOrder = "asc" | "desc";

export async function getAllUsersApi(
  token: string, 
  sortOrder: SortOrder, 
  setRole: string
): Promise<GetAllUsersResponse> {
  

  const params = new URLSearchParams({
    sortBy: 'name',
    sortOrder: sortOrder
  });

  if (setRole) {
    params.append('role', String(setRole).toUpperCase());
  }

  // 3. Convert parameters to a properly formatted string (includes automatic URL encoding)
  const queryString = params.toString();
  const fullUrl = `/api/vet/admin/users?${queryString}`; // Added the missing '?' separator
  
  logger.info('Request URL built:', fullUrl);
 
  return await api<GetAllUsersResponse>(fullUrl, {
    method: "GET",
    token,
  });
}
