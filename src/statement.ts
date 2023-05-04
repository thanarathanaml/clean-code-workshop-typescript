import { Games, Invoice } from "./types";
import { createStatementData, StatementData } from "./statementData";

export function statement(invoice: Invoice, games: Games) {
  return renderPlainText(createStatementData(invoice, games));
}

function renderPlainText(data: StatementData) {
  let result = `Statement for ${data.customer}\n`;
  for (const match of data.matches) {
    result += ` ${match.game.name}: ${match.amount} (${match.players} players)\n`;
  }
  result += `Amount owed is ${data.totalAmountInUsd}\n`;
  result += `You earned ${data.totalCredits} credits\n`;
  return result;
}
