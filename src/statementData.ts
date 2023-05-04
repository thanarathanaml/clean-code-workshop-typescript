import { Game, Games, Invoice, Match } from "./types";

type ExtendedMatch = Match & {
  game: Game;
  amount: string;
};

export type StatementData = {
  customer: string;
  matches: ExtendedMatch[];
  totalAmountInUsd: string;
  totalCredits: number;
};
export function createStatementData(invoice: Invoice, games: Games) {
  const statementData: StatementData = {} as StatementData;
  statementData.customer = invoice.customer;
  statementData.matches = invoice.matches.map(extendMatch);
  statementData.totalAmountInUsd = usdFor(
    totalGameAmount(statementData.matches)
  );
  statementData.totalCredits = totalGameCredits(statementData.matches);

  function extendMatch(match: Match) {
    const result: ExtendedMatch = { ...match } as ExtendedMatch;
    result.game = gameFor(result);
    result.amount = usdFor(amountFor(result));
    return result;
  }

  function usdFor(price: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price / 100);
  }

  function amountFor(match: ExtendedMatch): number {
    let result = 0;
    switch (match.game.type) {
      case "shooter":
        result = 400;
        if (match.players > 30) {
          result += 10 * (match.players - 30);
        }
        break;
      case "racing":
        result = 300;
        if (match.players > 20) {
          result += 100 + 5 * (match.players - 20);
        }
        result += 3 * match.players;
        break;
      default:
        throw new Error(`Unknown type: ${match.game.type}`);
    }
    return result;
  }

  function gameFor(match: Match): Game {
    return games[match.gameID];
  }

  function totalGameAmount(matches: ExtendedMatch[]): number {
    let result = 0;
    for (const match of matches) {
      result += amountFor(match);
    }
    return result;
  }

  function gameCreditsFor(match: ExtendedMatch): number {
    let credits = Math.max(match.players - 30, 0);
    // add extra credit for every ten racing players
    if ("racing" == match.game.type) credits += Math.floor(match.players / 10);
    return credits;
  }

  function totalGameCredits(matches: ExtendedMatch[]): number {
    let gameCredits = 0;
    for (const match of matches) {
      gameCredits += gameCreditsFor(match);
    }
    return gameCredits;
  }

  return statementData;
}
