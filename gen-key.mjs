import { Keypair } from "@solana/web3.js";
import fs from "fs";

const kp = Keypair.generate();

// Save private key as JSON array
fs.writeFileSync("executor-keypair.json", JSON.stringify([...kp.secretKey]));

console.log("✅ Executor wallet created");
console.log("Public key:", kp.publicKey.toBase58());
