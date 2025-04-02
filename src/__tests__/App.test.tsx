import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// Define mockNavigate before any tests
const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/", state: null }),
  };
});

// Mock the components to isolate App testing
vi.mock("../components/Header", () => ({
  default: () => <div data-testid="mocked-header">Header</div>,
}));

vi.mock("../pages/MainPage", () => ({
  default: () => <div data-testid="mocked-main-page">Main Page</div>,
}));

vi.mock("../pages/RolesInfoPage", () => ({
  default: () => (
    <div data-testid="mocked-roles-info-page">Roles Info Page</div>
  ),
}));

vi.mock("../pages/SetupPage", () => ({
  default: () => <div data-testid="mocked-setup-page">Setup Page</div>,
}));

vi.mock("../pages/SettingsPage", () => ({
  default: () => <div data-testid="mocked-settings-page">Settings Page</div>,
}));

vi.mock("../pages/SessionPage", () => ({
  default: () => <div data-testid="mocked-session-page">Session Page</div>,
}));

vi.mock("../pages/NotFoundPage", () => ({
  default: () => <div data-testid="mocked-not-found-page">Not Found Page</div>,
}));

vi.mock("../pages/StatsPage", () => ({
  default: () => <div data-testid="mocked-stats-page">Stats Page</div>,
}));

describe("App", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("redirects to /welcome when accessing /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/welcome");
  });

  it("renders the Header component except on session page", () => {
    render(
      <MemoryRouter initialEntries={["/welcome"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("mocked-header")).toBeInTheDocument();
  });

  it("renders the correct page component based on route", () => {
    render(
      <MemoryRouter initialEntries={["/welcome"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("mocked-main-page")).toBeInTheDocument();
  });

  it("renders the not found page for invalid routes", () => {
    render(
      <MemoryRouter initialEntries={["/invalid-route"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("mocked-not-found-page")).toBeInTheDocument();
  });
});
