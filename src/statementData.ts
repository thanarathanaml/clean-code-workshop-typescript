import { Game, Games, Invoice, Match } from "./types";

type ExtendedMatch = Match & {
  game: Game;
  amount: number;
  gameCredits: number;
};

export type StatementData = {
  customer: string;
  matches: ExtendedMatch[];
  totalAmount: number;
  totalCredits: number;
};

export class MatchCalculator {
  protected match: Match;
  protected game: Game;

  protected constructor(match: Match, game: Game) {
    this.match = match;
    this.game = game;
  }

  get amount(): number {
    throw new Error("Subclass Responsibility");
  }

  get gameCredits(): number {
    return Math.max(this.match.players - 30, 0);
  }
}

export class ShooterMatchCalculator extends MatchCalculator {
  get amount(): number {
    let result = 400;
    if (this.match.players > 30) {
      result += 10 * (this.match.players - 30);
    }
    return result;
  }
}

export class RacingMatchCalculator extends MatchCalculator {
  get amount(): number {
    let result = 300;
    if (this.match.players > 20) {
      result += 100 + 5 * (this.match.players - 20);
    }
    result += 3 * this.match.players;
    return result;
  }

  get gameCredits(): number {
    return super.gameCredits + Math.floor(this.match.players / 10);
  }
}

export class UnknownMatchCalculator extends MatchCalculator {
  get amount(): number {
    throw Error(`Unknown type: ${this.game.type}`);
  }
}

export function createStatementData(invoice: Invoice, games: Games) {
  const statementData: StatementData = {} as StatementData;
  statementData.customer = invoice.customer;
  statementData.matches = invoice.matches.map(extendMatch);
  statementData.totalAmount = totalGameAmount(statementData.matches);
  statementData.totalCredits = totalGameCredits(statementData.matches);

  function extendMatch(match: Match) {
    function createMatchCalculator(match: Match) {
      const GameMatchCalculator = gameFor(match).matchCalculator;
      return new GameMatchCalculator(match, gameFor(match));
    }

    let matchCalculator = createMatchCalculator(match);
    const result: ExtendedMatch = { ...match } as ExtendedMatch;
    result.game = gameFor(result);
    result.amount = matchCalculator.amount;
    result.gameCredits = matchCalculator.gameCredits;
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
      gameCredits += match.gameCredits;
    }
    return gameCredits;
  }

  return statementData;
}
