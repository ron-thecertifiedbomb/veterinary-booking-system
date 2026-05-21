import { useBookingSystem } from "@/hooks/useBookingSystem";
import { renderHook, waitFor } from "@testing-library/react-native";

global.fetch = jest.fn();

describe("useBookingSystem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading true and empty slots", () => {
    // Mock an unresolved promise to test loading state
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {}),
    );

    const { result } = renderHook(() => useBookingSystem("2026-05-22"));

    expect(result.current.loading).toBe(true);
    expect(result.current.slots).toEqual([]);
    expect(result.current.isTimeMismatch).toBe(false);
  });

  it("should fetch slots successfully", async () => {
    const mockResponse = {
      slots: [{ time: "10:00 AM", available: true }],
      now: "May 21, 2026, 10:00:00 AM", // A mock server time to test the date-fns parsing
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useBookingSystem("2026-05-22"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slots).toEqual(mockResponse.slots);
  });
});
