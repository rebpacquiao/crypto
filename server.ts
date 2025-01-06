import express from "express";
import { ethers } from "ethers";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Alchemy, Network } from "alchemy-sdk";
import { AlchemyProvider } from "@ethersproject/providers";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("MongoDB connected");

    // Define a simple schema and model
    const sampleSchema = new mongoose.Schema({
      name: String,
      value: Number,
    });

    const Sample = mongoose.model("Sample", sampleSchema);

    // Insert sample data
    const sampleData = new Sample({ name: "Test", value: 42 });
    sampleData.save().then(() => console.log("Sample data inserted"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

const alchemySettings = {
  apiKey: process.env.ALCHEMY_API_KEY!,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(alchemySettings);

app.get("/api/eth-info/:address", async (req, res) => {
  const { address } = req.params;

  try {
    // Connect to Ethereum network
    const provider = new AlchemyProvider(
      "homestead",
      process.env.ALCHEMY_API_KEY
    );

    const gasPrice = await provider.getGasPrice();

    const blockNumber = await provider.getBlockNumber();

    const balance = await provider.getBalance(address);

    const tokenBalances = await alchemy.core.getTokenBalances(address);
    const tokenMetadata = await Promise.all(
      tokenBalances.tokenBalances.map((token) =>
        alchemy.core.getTokenMetadata(token.contractAddress)
      )
    );

    res.json({
      gasPrice: gasPrice,
      blockNumber,
      balance: balance.toString(),
      tokenBalances,
      tokenMetadata,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
