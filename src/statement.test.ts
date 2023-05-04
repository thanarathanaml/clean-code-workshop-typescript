import { statement } from "./statement";
import games from "./data/games";

describe("Statement characterization test", () => {
  it("should run statement for invoices", () => {
    expect(
      statement(
        {
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
        },
        games
      )
    ).toStrictEqual(
      "Statement for test\n" +
        " Counter Strike: Global Offense: $4.00 (10 players)\n" +
        " Need For Speed: Unbound: $3.15 (5 players)\n" +
        " Need For Speed: Unbound: $6.20 (40 players)\n" +
        " Counter Strike: Global Offense: $6.00 (50 players)\n" +
        "Amount owed is $19.35\n" +
        "You earned 34 credits\n"
    );
  });
  it("should throw error for invalid game", () => {
    expect(() =>
      statement(
        { customer: "test", matches: [{ players: 10, gameID: "chess" }] },
        { chess: { name: "Chess", type: "board" } }
      )
    ).toThrow("Unknown type: board");
  });
});
