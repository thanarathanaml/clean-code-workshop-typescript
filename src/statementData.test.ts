import { createStatementData } from "./statementData";
import games from "./data/games";

const invoice = {
  customer: "test",
  matches: [
    {
      gameID: "csgo",
      players: 10,
    },
    {
      gameID: "nfs",
      players: 5,
    },
    {
      gameID: "nfs",
      players: 40,
    },
    {
      gameID: "csgo",
      players: 50,
    },
  ],
};

const statementData = {
  customer: "test",
  matches: [
    {
      amount: 400,
      credits: 0,
      game: {
        name: "Counter Strike: Global Offense",
        type: "shooter",
      },
      gameID: "csgo",
      players: 10,
    },
    {
      amount: 315,
      credits: 0,
      game: {
        name: "Need For Speed: Unbound",
        type: "racing",
      },
      gameID: "nfs",
      players: 5,
    },
    {
      amount: 620,
      credits: 14,
      game: {
        name: "Need For Speed: Unbound",
        type: "racing",
      },
      gameID: "nfs",
      players: 40,
    },
    {
      amount: 600,
      credits: 20,
      game: {
        name: "Counter Strike: Global Offense",
        type: "shooter",
      },
      gameID: "csgo",
      players: 50,
    },
  ],
  totalAmount: 1935,
  totalCredits: 34,
};

describe("Statement Data characterization test", () => {
  it("should generate statement data", () => {
    expect(createStatementData(invoice, games)).toStrictEqual(statementData);
  });
});
