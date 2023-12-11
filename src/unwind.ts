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

const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io:443" });

const liquidator = getSignerFromSeed(
  "royal reopen journey royal enlist vote core cluster shield slush hill sample",
  "Secp256k1"
);

const onChain = new OnChainCalls(liquidator, deployment, client);

const main = async () => {
  const client = new BluefinClient(true, Networks.PRODUCTION_SUI, liquidator);

  await client.init();

  console.log("Account address:", client.getPublicAddress());

  for (const market of ["ETH-PERP", "BTC-PERP"]) {
    try {
      const { isPosPositive, qPos } = await onChain.getUserPosition(market);
      const size = toBaseNumber(qPos, 3, 9);
      console.log({ market, isPosPositive, size });

      if (size > 0) {
        const signedOrder = await client.createSignedOrder({
          symbol: market,
          price: 0, // market order
          quantity: size,
          side: isPosPositive == true ? ORDER_SIDE.SELL : ORDER_SIDE.BUY,
          orderType: ORDER_TYPE.MARKET,
          leverage: 2,
        });

        console.dir(await client.placeSignedOrder(signedOrder), null);
      }
    } catch (e) {
      console.log({ market, isPosPositive: false, size: 0 });
    }
  }
};

main();
