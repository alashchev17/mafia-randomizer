export interface ISettings {
  amountOfPlayers: number;
  gameMode: string;
}

export interface INotification {
  text: string;
}

export interface IPlayer {
  role: string;
  roleSrc: string;
}

export interface IGameDeskPlayer {
  id: number;
  role: string;
  roleSrc: string;
  isMafia: boolean;
}

export interface IGameHistory {
  playerId: number;
  playerCard: string;
  reason: string;
  timestamp: {
    type: "День" | "Ночь";
    cycle: number;
  };
}

export interface IGameStats {
  type: "День" | "Ночь";
  counter: number;
  history: IGameHistory[];
}
