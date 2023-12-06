export interface ISettings {
  amountOfPlayers: number;
  gameMode: string;
}

export interface INotification {
  text: string;
}

export interface IPlayers {
  role: string;
  roleSrc: string;
}

export interface IGameDeskPlayers {
  id: number;
  role: string;
  roleSrc: string;
}
