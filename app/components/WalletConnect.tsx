import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { Web3Provider, EtherscanProvider } from "@ethersproject/providers";

const WalletConnect = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const provider: any = await detectEthereumProvider();
      if (provider) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        const ethersProvider = new Web3Provider(provider);
        const balance = await ethersProvider.getBalance(accounts[0]);
        setBalance(balance.toString());
        fetchTransactions(accounts[0], ethersProvider);
      } else {
        setError("MetaMask not detected");
      }
    } catch (err) {
      setError("Failed to connect wallet");
    }
  };

  const fetchTransactions = async (account: string, provider: Web3Provider) => {
    try {
      const etherscanProvider = new EtherscanProvider();
      const history = await etherscanProvider.getHistory(account);
      setTransactions(history.slice(-10));
    } catch (err) {
      setError("Failed to fetch transactions");
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {error && <p>{error}</p>}
      {account && (
        <div>
          <p>Account: {account}</p>
          <p>Balance: {balance} ETH</p>
          <h3>Recent Transactions:</h3>
          <ul>
            {transactions.map((tx, index) => (
              <li key={index}>
                {tx.hash} - {tx.value} ETH
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
