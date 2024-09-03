"use client"; // Indique que ce fichier doit être traité comme du code côté client

import { FC, useState } from 'react';
import { ethers } from 'ethers';

const ConnectMetaMask: FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(tempProvider);

      try {
        const accounts = await tempProvider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);

        // Fetch balance
        const balanceBigNumber = await tempProvider.getBalance(accounts[0]);
        const balanceInEth = ethers.formatEther(balanceBigNumber);
        setBalance(balanceInEth);
      } catch (error) {
        console.error('Failed to connect MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to use this feature.');
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>ETH Balance: {balance} ETH</p>
        </div>
      ) : (
        <button onClick={connectMetaMask}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default ConnectMetaMask;
