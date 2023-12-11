import {
  BluefinClient,
  Ed25519Keypair,
  Keypair,
  Networks,
  ORDER_SIDE,
  ORDER_TYPE,
  OrderSigner,
} from "@bluefin-exchange/bluefin-v2-client";

async function main() {
  const seed =
    "royal reopen journey royal enlist vote core cluster shield slush hill sample";

  const kp = Ed25519Keypair.deriveKeypair(seed);

  const client = new BluefinClient(true, Networks["TESTNET_SUI"], kp);

  await client.init(true);

  const signedOrder = await client.createSignedOrder({
    symbol: "ETH-PERP",
    price: 0,
    quantity: 0.02,
    side: ORDER_SIDE.SELL,
    orderType: ORDER_TYPE.MARKET,
    leverage: 3,
  });

  console.dir(await client.placeSignedOrder(signedOrder), null);
}

main();
