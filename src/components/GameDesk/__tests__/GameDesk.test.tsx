import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import GameDesk from "../index";
import sessionReducer, { initializeSession } from "../../../store/sessionSlice";
import statsReducer from "../../../store/statsSlice";
import { IPlayer } from "../../../models";
import { ROLES } from "../../../utils/roleAssets";

vi.mock("../../GameDeskCard", () => ({
  default: ({ playerId }: { playerId: number }) => (
    <div data-testid={`game-desk-card-${playerId}`} data-player-id={playerId}>
      Player Card {playerId}
    </div>
  ),
}));

const testPlayers: IPlayer[] = [
  { role: ROLES.INNOCENT },
  { role: ROLES.MAFIA },
  { role: ROLES.SHERIFF },
  { role: ROLES.DON },
  { role: ROLES.INNOCENT },
  { role: ROLES.DOCTOR },
];

const renderWithStore = () => {
  const store = configureStore({ reducer: { session: sessionReducer, stats: statsReducer } });
  store.dispatch(initializeSession({ players: testPlayers }));
  return {
    store,
    ...render(
      <Provider store={store}>
        <GameDesk />
      </Provider>
    ),
  };
};

describe("GameDesk", () => {
  it("renders one GameDeskCard per player in playerOrder", () => {
    renderWithStore();
    expect(screen.getAllByTestId(/game-desk-card-/).length).toBe(testPlayers.length);
  });

  it("renders cards with playerIds from 1..N", () => {
    renderWithStore();
    testPlayers.forEach((_, idx) => {
      expect(screen.getByTestId(`game-desk-card-${idx + 1}`)).toBeInTheDocument();
    });
  });

  it("applies the size-suffix class based on player count", () => {
    renderWithStore();
    const grid = document.querySelector(".game-desk__cards");
    expect(grid).toHaveClass(`game-desk__cards--${testPlayers.length}`);
  });

  it("initializeSession marks Дон and Мафия as mafia roles", () => {
    const { store } = renderWithStore();
    const players = store.getState().session.players;
    expect(players[2].isMafia).toBe(true); // index 1 → id 2 → Мафия
    expect(players[4].isMafia).toBe(true); // index 3 → id 4 → Дон
    expect(players[1].isMafia).toBe(false);
    expect(players[3].isMafia).toBe(false);
    expect(players[6].isMafia).toBe(false); // Доктор
  });
});
