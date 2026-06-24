import { api } from "@/utils/api/api.client";

interface DeleteUsertResponse {
  message: string;
}

export async function deleteUsersApi(
    ids: string[],
  token: string
): Promise<DeleteUsertResponse> {

  return await api<DeleteUsertResponse>(
    `/api/vet/admin/users/${ids}/`,
    {
      method: "DELETE",
      token,
    }
  );
}
