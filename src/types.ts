export type Invoice = {
  customer: string;
  matches: Match[];
};

export type Match = {
  gameID: string;
  players: number;
};

export type Games = {
  [gameId: string]: Game;
};

export type Game = {
  name: string;
  type: string;
};
