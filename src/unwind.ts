/* eslint-disable prettier/prettier */
import { ORDER_SIDE, ORDER_TYPE } from "@firefly-exchange/library-sui";
import { BluefinClient, Networks } from "@bluefin-exchange/bluefin-v2-client";

const main = async () => {
  const client = new BluefinClient(
    true,
    Networks.TESTNET_SUI, // select network
    "royal reopen journey royal enlist vote core cluster shield slush hill sample",
    "Secp256k1"
  );

  await client.init();

  console.log("Account address:", client.getPublicAddress());

  const signedOrder = await client.createSignedOrder({
    symbol: "BTC-PERP",
    price: 0, // market order
    quantity: 0.02, // should be user position size
    side: ORDER_SIDE.SELL, // should be inverse of user's current position
    orderType: ORDER_TYPE.MARKET,
    leverage: 2,
  });

  console.dir(await client.placeSignedOrder(signedOrder), null);
};

main();
