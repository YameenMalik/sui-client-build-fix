"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluefin_v2_client_1 = require("@bluefin-exchange/bluefin-v2-client");
async function main() {
    const client = new bluefin_v2_client_1.BluefinClient(true, bluefin_v2_client_1.Networks["PRODUCTION_SUI"]);
}
main();
