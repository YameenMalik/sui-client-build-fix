import {
  toBigNumberStr,
  getSignerFromSeed,
  OnChainCalls,
  Transaction,
  readFile,
  SuiClient,
} from "@bluefin-exchange/bluefin-v2-client";

const deployment = readFile("./deployment.json");

const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io:443" });
const liquidator = getSignerFromSeed(
  "royal reopen journey royal enlist vote core cluster shield slush hill sample", // provide liquidator phrase
  "Secp256k1"
);

const onChain = new OnChainCalls(liquidator, deployment, client);

async function main() {
  const liqAddress = await liquidator.getPublicKey().toSuiAddress();
  console.log("Liquidator:", liqAddress);

  const args = [
    {
      market: "ETH-PERP", // market
      liquidatee:
        "0xa7966620030bb486fca34508e588018af3ad9b197790b2830ac3a84be1c872ca", // account address
      quantity: toBigNumberStr(0.01, 18), // the quantity to be liquidated
      leverage: toBigNumberStr(2, 18),
      allOrNothing: false,
    },
    // add more liquidatees over here
  ];

  try {
    const txBlock = await onChain.getBatchLiquidationTransactionBlock(
      args,
      9_000_000_000 // optional but better to provide
    );
    await onChain.executeTxBlock(txBlock);
  } catch (e) {
    const error = Transaction.getDryRunError(String(e));
    const txNumber = Transaction.getTxNumber(String(e));
    if (error) console.log("Error:", error, "at tx:", txNumber);
    else console.log(String(e));
  }
}

main();
