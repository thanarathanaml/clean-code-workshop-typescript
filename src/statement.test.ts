import { htmlStatement, statement } from "./statement";
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
describe("Statement characterization test", () => {
  it("should run statement for invoices", () => {
    expect(statement(invoice, games)).toStrictEqual(
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
  it("should run htmlStatement for invoices", () => {
    expect(htmlStatement(invoice, games)).toStrictEqual(
      "<h1>Statement for <b>test</b></h1>\n" +
        "<table><tr><th>Game</th><th>Players</th><th>Cost</th></tr>" +
        "<tr><td>Counter Strike: Global Offense</td><td>10</td><td>$4.00</td></tr>\n" +
        "<tr><td>Need For Speed: Unbound</td><td>5</td><td>$3.15</td></tr>\n" +
        "<tr><td>Need For Speed: Unbound</td><td>40</td><td>$6.20</td></tr>\n" +
        "<tr><td>Counter Strike: Global Offense</td><td>50</td><td>$6.00</td></tr>\n" +
        "</table>" +
        "<p>Amount owed is <em>$19.35</em></p<p>You earned <em>34</em> credits</p>\n"
    );
  });
});
