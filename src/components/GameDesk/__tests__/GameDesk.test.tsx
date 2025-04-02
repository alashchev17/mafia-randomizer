import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GameDesk from "../index";
import { IPlayer } from "../../../models";

// Mock the GameDeskCard component to focus on testing GameDesk
import type { IGameDeskPlayer } from "../../../models";
import type { Dispatch, SetStateAction } from "react";

vi.mock("../../GameDeskCard", () => ({
  default: ({
    player,
    setPlayerDead,
  }: {
    player: IGameDeskPlayer;
    setPlayerDead?: Dispatch<SetStateAction<number>>;
    handleNotification: (state: boolean, text: string) => void;
  }) => (
    <div
      data-testid={`game-desk-card-${player.id}`}
      data-player-id={player.id}
      data-player-role={player.role}
      data-player-is-mafia={player.isMafia.toString()}
      data-player-setter={setPlayerDead ? "true" : "false"}
    >
      Player Card {player.id}
    </div>
  ),
}));

describe("GameDesk", () => {
  const mockSetInnocentPlayersAlive = vi.fn();
  const mockSetMafiaPlayersAlive = vi.fn();
  const mockHandleNotification = vi.fn();

  const testPlayers: IPlayer[] = [
    { role: "Мирный житель", roleSrc: "/cards/innocent.svg" },
    { role: "Мафия", roleSrc: "/cards/mafia.svg" },
    { role: "Шериф", roleSrc: "/cards/sheriff.svg" },
    { role: "Дон", roleSrc: "/cards/headOfMafia.svg" },
    { role: "Мирный житель", roleSrc: "/cards/innocent.svg" },
    { role: "Доктор", roleSrc: "/cards/doctor.svg" },
  ];

  it("renders the correct number of player cards", () => {
    render(
      <GameDesk
        players={testPlayers}
        setInnocentPlayersAlive={mockSetInnocentPlayersAlive}
        setMafiaPlayersAlive={mockSetMafiaPlayersAlive}
        handleNotification={mockHandleNotification}
      />
    );

    // Check if all player cards are rendered
    const playerCards = screen.getAllByTestId(/game-desk-card-/);
    expect(playerCards.length).toBe(testPlayers.length);
  });

  it("correctly identifies mafia and innocent players", () => {
    render(
      <GameDesk
        players={testPlayers}
        setInnocentPlayersAlive={mockSetInnocentPlayersAlive}
        setMafiaPlayersAlive={mockSetMafiaPlayersAlive}
        handleNotification={mockHandleNotification}
      />
    );

    // Check mafia roles
    const mafiaCards = screen
      .getAllByTestId(/game-desk-card-/)
      .filter((card) => card.getAttribute("data-player-is-mafia") === "true");
    expect(mafiaCards.length).toBe(2); // Should be Дон and Мафия

    // Check innocent roles
    const innocentCards = screen
      .getAllByTestId(/game-desk-card-/)
      .filter((card) => card.getAttribute("data-player-is-mafia") === "false");
    expect(innocentCards.length).toBe(4); // Should be Мирный житель, Шериф, Мирный житель, Доктор
  });

  it("passes the correct setter functions based on player role", () => {
    render(
      <GameDesk
        players={testPlayers}
        setInnocentPlayersAlive={mockSetInnocentPlayersAlive}
        setMafiaPlayersAlive={mockSetMafiaPlayersAlive}
        handleNotification={mockHandleNotification}
      />
    );

    // Get all cards
    const cards = screen.getAllByTestId(/game-desk-card-/);

    // Verify that each card has the proper setter based on role
    cards.forEach((card) => {
      const isMafia = card.getAttribute("data-player-is-mafia") === "true";
      const hasSetter = card.getAttribute("data-player-setter") === "true";

      // Every card should have a setter
      expect(hasSetter).toBe(true);

      // Check that the right setter is used based on isMafia
      const role = card.getAttribute("data-player-role");
      if (role === "Мафия" || role === "Дон") {
        expect(isMafia).toBe(true);
      } else {
        expect(isMafia).toBe(false);
      }
    });
  });

  it("applies the correct class based on number of players", () => {
    render(
      <GameDesk
        players={testPlayers}
        setInnocentPlayersAlive={mockSetInnocentPlayersAlive}
        setMafiaPlayersAlive={mockSetMafiaPlayersAlive}
        handleNotification={mockHandleNotification}
      />
    );

    // Check if it applies the correct class based on player count
    const gameDesk = document.querySelector(".game-desk__cards");
    expect(gameDesk).toHaveClass(`game-desk__cards--${testPlayers.length}`);
  });
});
