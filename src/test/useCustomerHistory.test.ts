import { useCustomerHistory } from "@/hooks/useCutomerHistory";
import { API } from "@/utils/api";
import { renderHook, waitFor } from "@testing-library/react-native";

global.fetch = jest.fn();

describe("useCustomerHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty history and not fetch if ownerName is empty", () => {
    const { result } = renderHook(() => useCustomerHistory(""));

    expect(result.current.loading).toBe(false);
    expect(result.current.history).toEqual([]);
    expect(result.current.error).toBeNull();

    // It should immediately return without calling fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should fetch and return history successfully", async () => {
    const mockData = [
      {
        id: 1,
        ownerName: "John Doe",
        petName: "Buddy",
        serviceType: "Vaccination",
        appointmentDate: "2026-05-21T10:00:00Z",
        status: "completed",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useCustomerHistory("John Doe"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.history).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      `${API}/appointments/history?ownerName=John%20Doe`,
    );
  });

  it("should handle API errors correctly", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error"),
    );

    const { result } = renderHook(() => useCustomerHistory("Jane Doe"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network Error");
    expect(result.current.history).toEqual([]);
  });
});
