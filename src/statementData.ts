import { Game, Games, Invoice, Match } from "./types";

type ExtendedMatch = Match & {
  game: Game;
  amount: number;
  credits: number;
};

export type StatementData = {
  customer: string;
  matches: ExtendedMatch[];
  totalAmount: number;
  totalCredits: number;
};

class MatchCalculator {
  private match: Match;
  private game: Game;

  constructor(match: Match, game: Game) {
    this.match = match;
    this.game = game;
  }

  get amount() {
    let result = 0;
    switch (this.game.type) {
      case "shooter":
        result = 400;
        if (this.match.players > 30) {
          result += 10 * (this.match.players - 30);
        }
        break;
      case "racing":
        result = 300;
        if (this.match.players > 20) {
          result += 100 + 5 * (this.match.players - 20);
        }
        result += 3 * this.match.players;
        break;
      default:
        throw new Error(`Unknown type: ${this.game.type}`);
    }
    return result;
  }

  get gameCredits() {
    let credits = Math.max(this.match.players - 30, 0);
    // add extra credit for every ten racing players
    if ("racing" == this.game.type)
      credits += Math.floor(this.match.players / 10);
    return credits;
  }
}

export function createStatementData(invoice: Invoice, games: Games) {
  const statementData: StatementData = {} as StatementData;
  statementData.customer = invoice.customer;
  statementData.matches = invoice.matches.map(extendMatch);
  statementData.totalAmount = totalGameAmount(statementData.matches);
  statementData.totalCredits = totalGameCredits(statementData.matches);

  function extendMatch(match: Match) {
    const result: ExtendedMatch = { ...match } as ExtendedMatch;
    result.game = gameFor(result);
    const matchCalculator = new MatchCalculator(match, gameFor(result));
    result.amount = matchCalculator.amount;
    result.credits = matchCalculator.gameCredits;
    return result;

    function gameFor(match: Match): Game {
      return games[match.gameID];
    }
  }

  function totalGameAmount(matches: ExtendedMatch[]): number {
    let result = 0;
    for (const match of matches) {
      result += match.amount;
    }
    return result;
  }

  function totalGameCredits(matches: ExtendedMatch[]): number {
    let gameCredits = 0;
    for (const match of matches) {
      gameCredits += match.credits;
    }
    return gameCredits;
  }

  return statementData;
}
