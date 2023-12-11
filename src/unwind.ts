/* eslint-disable prettier/prettier */
import { ORDER_SIDE, ORDER_TYPE } from "@firefly-exchange/library-sui";
import {
  BluefinClient,
  Networks,
  OnChainCalls,
  SuiClient,
  getSignerFromSeed,
  readFile,
  toBaseNumber,
} from "@bluefin-exchange/bluefin-v2-client";
const deployment = readFile("./deployment.json");

const main = async () => {
  const suiClient = new SuiClient({
    url: "https://fullnode.mainnet.sui.io:443",
  });

  const liquidatorsPhrase = [
    "royal reopen journey royal enlist vote core cluster shield slush hill sample",
    "royal reopen journey royal enlist vote core cluster shield slush hill sample",
  ];

  for (const phrase of liquidatorsPhrase) {
    const liquidator = getSignerFromSeed(phrase, "Secp256k1");

    const onChain = new OnChainCalls(liquidator, deployment, suiClient);

    const bluefinClient = new BluefinClient(
      true,
      Networks.PRODUCTION_SUI,
      liquidator
    );

    await bluefinClient.init();

    console.log("Account address:", bluefinClient.getPublicAddress());

    for (const market of ["ETH-PERP", "BTC-PERP"]) {
      try {
        const { isPosPositive, qPos } = await onChain.getUserPosition(market);
        const size = toBaseNumber(qPos, 3, 9);
        console.log({ market, isPosPositive, size });

        if (size > 0) {
          const signedOrder = await bluefinClient.createSignedOrder({
            symbol: market,
            price: 0, // market order
            quantity: size,
            side: isPosPositive == true ? ORDER_SIDE.SELL : ORDER_SIDE.BUY,
            orderType: ORDER_TYPE.MARKET,
            leverage: 2,
          });

          console.dir(await bluefinClient.placeSignedOrder(signedOrder), null);
        }
      } catch (e) {
        console.log({ market, isPosPositive: false, size: 0 });
      }
    }
  }
};

main();
