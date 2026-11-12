import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import Dashboard from "./Dashboard";
import eventService from "../../Services/EventService";
import authService from "../../Services/AuthService";

vi.mock("../../Services/EventService", () => ({
  default: {
    getAllEvents: vi.fn(),
    getMyRSVPs: vi.fn(),
    getMyCreatedEvents: vi.fn(),
  },
}));

vi.mock("../../Services/AuthService", () => ({
  default: {
    isAuthenticated: vi.fn(),
  },
}));

vi.mock("../Events/EventCard/EventCard", () => ({
  default: () => null,
}));

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<div>Login required</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  authService.isAuthenticated.mockReturnValue(true);
  eventService.getAllEvents.mockResolvedValue({
    events: [],
    totalPages: 0,
    success: true,
  });
  eventService.getMyRSVPs.mockResolvedValue({
    events: [],
    totalPages: 0,
    success: true,
  });
  eventService.getMyCreatedEvents.mockResolvedValue({
    events: [],
    totalPages: 0,
    success: true,
  });
});

test("loads personal event scopes using the selected time filter", async () => {
  renderDashboard();

  await waitFor(() =>
    expect(eventService.getAllEvents).toHaveBeenCalledWith(
      0,
      3,
      "UPCOMING",
      "",
    ),
  );

  fireEvent.click(screen.getByRole("button", { name: "Event scope: All events" }));
  fireEvent.click(await screen.findByRole("menuitem", { name: "My RSVPs" }));

  await waitFor(() =>
    expect(eventService.getMyRSVPs).toHaveBeenCalledWith(0, 3, "UPCOMING"),
  );

  fireEvent.click(screen.getByRole("tab", { name: /past/i }));

  await waitFor(() =>
    expect(eventService.getMyRSVPs).toHaveBeenCalledWith(0, 3, "PAST"),
  );

  fireEvent.click(screen.getByRole("button", { name: "Event scope: My RSVPs" }));
  fireEvent.click(await screen.findByRole("menuitem", { name: "Created by me" }));

  await waitFor(() =>
    expect(eventService.getMyCreatedEvents).toHaveBeenCalledWith(0, 3, "PAST"),
  );

  fireEvent.click(screen.getByRole("tab", { name: /upcoming/i }));

  await waitFor(() =>
    expect(eventService.getMyCreatedEvents).toHaveBeenCalledWith(
      0,
      3,
      "UPCOMING",
    ),
  );
});

test("sends logged-out visitors to login when they choose a personal scope", async () => {
  authService.isAuthenticated.mockReturnValue(false);
  renderDashboard();

  fireEvent.click(
    await screen.findByRole("button", { name: "Event scope: All events" }),
  );
  fireEvent.click(await screen.findByRole("menuitem", { name: "Created by me" }));

  expect(await screen.findByText("Login required")).toBeInTheDocument();
});
