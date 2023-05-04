import { Games, Invoice, Match } from "./types";

export function statement(invoice: Invoice, games: Games) {
  let totalAmount = 0;
  let gameCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  function amountFor(match: Match) {
    let result = 0;
    switch (gameFor(match).type) {
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
        throw new Error(`Unknown type: ${gameFor(match).type}`);
    }
    return result;
  }

  function gameFor(match: Match) {
    return games[match.gameID];
  }

  for (const m of invoice.matches) {
    // add game credits
    gameCredits += Math.max(m.players - 30, 0);
    // add extra credit for every ten racing players
    if ("racing" == gameFor(m).type) gameCredits += Math.floor(m.players / 10);

    // print line for this match
    result += ` ${gameFor(m).name}: ${format(amountFor(m) / 100)} (${
      m.players
    } players)\n`;

    totalAmount += amountFor(m);
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${gameCredits} credits\n`;
  return result;
}
