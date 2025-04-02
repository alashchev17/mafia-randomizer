import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PlayerCard from "../index";
import { IPlayer } from "../../../models";

describe("PlayerCard", () => {
  const mockPlayer: IPlayer = {
    role: "Мирный житель",
    roleSrc: "/cards/innocent.svg",
  };

  const mockSetIsRevealed = vi.fn();
  const mockSetIsRevealing = vi.fn();

  beforeEach(() => {
    mockSetIsRevealed.mockClear();
    mockSetIsRevealing.mockClear();
    vi.useFakeTimers();
  });

  it("renders correctly when not revealed", () => {
    render(
      <PlayerCard
        isRevealed={false}
        setIsRevealed={mockSetIsRevealed}
        isRevealing={false}
        setIsRevealing={mockSetIsRevealing}
        currentPlayer={mockPlayer}
      />
    );

    expect(screen.getByAltText("Backside Card")).toBeInTheDocument();
    expect(screen.getByAltText("Мирный житель")).toHaveClass("active");
  });

  it("reveals card on click and calls appropriate functions", () => {
    render(
      <PlayerCard
        isRevealed={false}
        setIsRevealed={mockSetIsRevealed}
        isRevealing={false}
        setIsRevealing={mockSetIsRevealing}
        currentPlayer={mockPlayer}
      />
    );

    const card = screen.getByAltText("Backside Card").closest(".player-card");
    fireEvent.click(card!);

    expect(mockSetIsRevealed).toHaveBeenCalledWith(true);
    expect(mockSetIsRevealing).toHaveBeenCalledWith(true);

    // Fast-forward time to complete the animation
    vi.advanceTimersByTime(2000);

    expect(mockSetIsRevealing).toHaveBeenCalledWith(false);
  });

  it("renders correctly when revealed", () => {
    render(
      <PlayerCard
        isRevealed={true}
        setIsRevealed={mockSetIsRevealed}
        isRevealing={false}
        setIsRevealing={mockSetIsRevealing}
        currentPlayer={mockPlayer}
      />
    );

    expect(screen.getByAltText("Мирный житель")).toBeInTheDocument();
    expect(screen.getByAltText("Backside Card")).toHaveClass("active");
  });

  it("does not trigger reveal logic if already revealed", () => {
    render(
      <PlayerCard
        isRevealed={true}
        setIsRevealed={mockSetIsRevealed}
        isRevealing={false}
        setIsRevealing={mockSetIsRevealing}
        currentPlayer={mockPlayer}
      />
    );

    const card = screen.getByAltText("Мирный житель").closest(".player-card");
    fireEvent.click(card!);

    expect(mockSetIsRevealed).not.toHaveBeenCalled();
    expect(mockSetIsRevealing).not.toHaveBeenCalled();
  });

  it("is disabled during revealing animation", () => {
    render(
      <PlayerCard
        isRevealed={true}
        setIsRevealed={mockSetIsRevealed}
        isRevealing={true}
        setIsRevealing={mockSetIsRevealing}
        currentPlayer={mockPlayer}
      />
    );

    const card = screen.getByAltText("Мирный житель").closest(".player-card");
    expect(card).toHaveClass("disabled");
  });
});
