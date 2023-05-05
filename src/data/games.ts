import { Games } from "../types";
import {
  RacingMatchCalculator,
  ShooterMatchCalculator,
} from "../statementData";

const games: Games = {
  nfs: {
    name: "Need For Speed: Unbound",
    type: "racing",
    matchCalculator: RacingMatchCalculator,
  },
  fh5: {
    name: "Forza Horizon 5",
    type: "racing",
    matchCalculator: RacingMatchCalculator,
  },
  csgo: {
    name: "Counter Strike: Global Offense",
    type: "shooter",
    matchCalculator: ShooterMatchCalculator,
  },
  pubg: {
    name: "Player Unknown's Battleground",
    type: "shooter",
    matchCalculator: ShooterMatchCalculator,
  },
  // rev: {
  //   name: "Resident Evil: Village",
  //   type: "horror",
  // },
  // out: { name: "Outlast", type: "horror" },
};

export default games;
