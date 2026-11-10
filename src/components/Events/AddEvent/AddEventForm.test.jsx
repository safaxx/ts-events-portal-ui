import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import AddEventForm from "./AddEventForm";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: null }),
  useParams: () => ({}),
}));

vi.mock("../../../utils/TimeZoneUtils", () => ({
  getTimezoneAbbreviation: () => "UTC",
  getUserTimezone: () => "UTC",
}));

vi.mock("../../Services/EventService", () => ({
  __esModule: true,
  default: {
    createEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
    getEventById: vi.fn(),
  },
}));

test("renders an upload image field", () => {
  render(
    <MemoryRouter>
      <AddEventForm />
    </MemoryRouter>
  );

  expect(screen.getByLabelText(/upload event image/i)).toBeInTheDocument();
});
