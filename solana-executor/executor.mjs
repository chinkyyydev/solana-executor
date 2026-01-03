import express from "express";
import fs from "fs";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { createJupiterApiClient } from "@jup-ag/api";

const app = express();
app.use(express.json());

// ENV
const PORT = process.env.PORT || 3000;
const RPC = "https://api.mainnet-beta.solana.com";

// Solana setup
const connection = new Connection(RPC);
const wallet = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync("keypair.json")))
);

// Jupiter
const jupiter = createJupiterApiClient();

app.post("/trade", async (req, res) => {
  try {
    const { action, mint, amountSol } = req.body;

    if (action !== "BUY") {
      return res.status(400).json({ error: "Unsupported action" });
    }

    const quote = await jupiter.quoteGet({
      inputMint: "So11111111111111111111111111111111111111112",
      outputMint: mint,
      amount: amountSol,
      slippageBps: 100
    });

    const swap = await jupiter.swapPost({
      quoteResponse: quote,
      userPublicKey: wallet.publicKey.toBase58()
    });

    res.json({
      success: true,
      txid: swap.swapTransaction
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Executor running on port ${PORT}`);
});
