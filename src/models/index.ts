import type { RoleKey } from "../utils/roleAssets";

export interface ISettings {
  amountOfPlayers: number;
  gameMode: string;
}

export interface INotification {
  text: string;
}

export interface IPlayer {
  role: RoleKey;
}

export interface IGameHistory {
  playerId: number;
  playerRole: RoleKey;
  reason: string;
  timestamp: {
    phase: IGamePhase;
    cycle: number;
  };
}

export enum IGamePhase {
  DAY = "DAY",
  NIGHT = "NIGHT",
}

export interface IGameStats {
  phase: IGamePhase;
  counter: number;
  gameLog: IGameHistory[];
}
