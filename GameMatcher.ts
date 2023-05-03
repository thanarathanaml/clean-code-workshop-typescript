import games from "./src/data/games";
import { statement } from "./src/statement";
import yargs from "yargs";
import fs from "fs/promises";
import path from "path";
import { hideBin } from "yargs/helpers";
import { Invoice } from "./src/types";

function printInvoiceStatementFor(invoicePath: string) {
  fs.readFile(path.join(__dirname, invoicePath), {
    encoding: "utf-8",
  }).then((data) => {
    const invoices: Invoice[] = JSON.parse(data) as Invoice[];
    for (const invoice of invoices) {
      console.info(statement(invoice, games));
    }
  });
}

yargs(hideBin(process.argv))
  .usage("$0 <cmd> [args]")
  .command(
    "invoice [path]",
    "Generate Invoice",
    (yargs) => {
      return yargs.positional("path", {
        type: "string",
        default: "invoices.json",
        description: "Path to invoices json",
      });
    },
    (args) => {
      printInvoiceStatementFor(args.path);
    }
  )
  .demandCommand(1)
  .help()
  .parseSync();
