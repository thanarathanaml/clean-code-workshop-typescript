import { Games, Invoice } from "./types";
import { createStatementData, StatementData } from "./statementData";

export function statement(invoice: Invoice, games: Games) {
  return renderPlainText(createStatementData(invoice, games));
}

function renderPlainText(data: StatementData) {
  let result = `Statement for ${data.customer}\n`;
  for (const match of data.matches) {
    result += ` ${match.game.name}: ${usdFor(match.amount)} (${
      match.players
    } players)\n`;
  }
  result += `Amount owed is ${usdFor(data.totalAmount)}\n`;
  result += `You earned ${data.totalCredits} credits\n`;
  return result;
}

export function htmlStatement(invoice: Invoice, games: Games) {
  return renderHtmlText(createStatementData(invoice, games));
}

function renderHtmlText(data: StatementData) {
  let result = `<h1>Statement for <b>${data.customer}</b></h1>\n`;
  result += "<table><tr><th>Game</th><th>Players</th><th>Cost</th></tr>";
  for (const match of data.matches) {
    result += `<tr><td>${match.game.name}</td><td>${
      match.players
    }</td><td>${usdFor(match.amount)}</td></tr>\n`;
  }
  result += "</table>";
  result += `<p>Amount owed is <em>${usdFor(
    data.totalAmount
  )}</em></p<p>You earned <em>${data.totalCredits}</em> credits</p>\n`;
  return result;
}

function usdFor(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price / 100);
}
