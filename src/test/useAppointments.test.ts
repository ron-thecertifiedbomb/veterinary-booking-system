import { useAppointments } from "@/hooks/useAppointments";
import { renderHook, waitFor } from "@testing-library/react-native";

// Mock any global fetch or API service used in the hook.
// Adjust this depending on what data fetching library (e.g., axios) you're using.
global.fetch = jest.fn();

describe("useAppointments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initially return loading true and empty appointments", () => {
    // Mock an unresolved promise to test the loading state
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {}),
    );

    const { result } = renderHook(() => useAppointments());

    expect(result.current.loading).toBe(true);
    expect(result.current.appointments).toEqual([]);
    expect(typeof result.current.refresh).toBe("function");
  });

  it("should fetch and return appointments", async () => {
    const mockAppointments = [
      {
        id: 1,
        ownerName: "John Doe",
        petName: "Max",
        serviceType: "Checkup",
        status: "pending",
        appointmentDate: "2026-05-21T10:00:00Z",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAppointments,
    });

    const { result } = renderHook(() => useAppointments());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.appointments).toEqual(mockAppointments);
  });
});
