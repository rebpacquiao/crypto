import express from "express";
import { ethers } from "ethers";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Alchemy, Network } from "alchemy-sdk";

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

// Middleware to parse JSON
app.use(express.json());

// Alchemy settings
const alchemySettings = {
  apiKey: process.env.ALCHEMY_API_KEY!,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(alchemySettings);

// API endpoint
app.get("/api/eth-info/:address", async (req, res) => {
  const { address } = req.params;

  // try {
  //   // Connect to Ethereum network
  //   const provider = new ethers.providers.AlchemyProvider(
  //     "homestead",
  //     process.env.ALCHEMY_API_KEY
  //   );

  //   // Fetch gas price
  //   const gasPrice = await provider.getGasPrice();

  //   // Fetch current block number
  //   const blockNumber = await provider.getBlockNumber();

  //   // Fetch balance of the given address
  //   const balance = await provider.getBalance(address);

  //   // Fetch token balances and metadata using Alchemy SDK
  //   const tokenBalances = await alchemy.core.getTokenBalances(address);
  //   const tokenMetadata = await Promise.all(
  //     tokenBalances.tokenBalances.map((token) =>
  //       alchemy.core.getTokenMetadata(token.contractAddress)
  //     )
  //   );

  //   // Return data in JSON format
  //   res.json({
  //     gasPrice: ethers.utils.formatUnits(gasPrice, "gwei"),
  //     blockNumber,
  //     balance: ethers.utils.formatEther(balance),
  //     tokenBalances,
  //     tokenMetadata,
  //   });
  // } catch (error: any) {
  //   res.status(500).json({ error: error.message });
  // }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
