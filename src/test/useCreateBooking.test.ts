import { useCreateBooking } from "@/hooks/useCreateBooking";
import { act, renderHook, waitFor } from "@testing-library/react-native";


global.fetch = jest.fn();

describe("useCreateBooking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useCreateBooking());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    // Depending on implementation, you might want to test the default for success
    expect(result.current.success).toBe(false);
  });

  it("should successfully create a booking", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    const { result } = renderHook(() => useCreateBooking());

    act(() => {
      result.current.createBooking({
        ownerName: "Jane Doe",
        petName: "Bella",
        serviceType: "Vaccination",
        date: "2026-05-22",
        time: "10:00",
      });
    });

    await waitFor(() => {
      expect(result.current.success).toBe(true);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle resetSuccess correctly", async () => {
    const { result } = renderHook(() => useCreateBooking());

    // Make sure the resetSuccess method is provided
    expect(typeof result.current.resetSuccess).toBe("function");

    act(() => {
      result.current.resetSuccess();
    });

    expect(result.current.success).toBe(false);
  });
});
