import { BluefinClient, Networks } from "@bluefin-exchange/bluefin-v2-client";

async function main() {
  const client = new BluefinClient(true, Networks["PRODUCTION_SUI"]);
}

main();
