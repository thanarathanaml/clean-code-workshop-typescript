import { Game, Games, Invoice } from "./types";

export function statement(invoice: Invoice, games: Games) {
  let totalAmount = 0;
  let gameCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;
  for (const m of invoice.matches) {
    const g: Game = games[m.gameID];
    let thisAmount = 0;
    switch (g.type) {
      case "shooter":
        thisAmount = 400;
        if (m.players > 30) {
          thisAmount += 10 * (m.players - 30);
        }
        break;
      case "racing":
        thisAmount = 300;
        if (m.players > 20) {
          thisAmount += 100 + 5 * (m.players - 20);
        }
        thisAmount += 3 * m.players;
        break;
      default:
        throw new Error(`Unknown type: ${g.type}`);
    }

    // add game credits
    gameCredits += Math.max(m.players - 30, 0);
    // add extra credit for every ten racing players
    if ("racing" == g.type) gameCredits += Math.floor(m.players / 10);

    // print line for this match
    result += ` ${g.name}: ${format(thisAmount / 100)} (${
      m.players
    } players)\n`;

    totalAmount += thisAmount;
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${gameCredits} credits\n`;
  return result;
}
