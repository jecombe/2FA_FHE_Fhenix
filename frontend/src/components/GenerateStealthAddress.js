import React, { useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import { FhenixClient, EncryptedType, EncryptedUint8 } from "fhenixjs";
import { contractABI } from "../Abi/Abi";

function GenerateStealthAddress() {
  const [SecondAddress, setSecondAddress] = useState("");
  const [timer, setTimer] = useState(0);

  const onButtonclick = async (e) => {
    e.preventDefault();
    const provider = new BrowserProvider(window.ethereum);
    const client = new FhenixClient({ provider });
    // to encrypt data for a Fhenix contract
    let resultAddress;
    try {
      resultAddress = await client.encrypt_address(SecondAddress);

      console.log(resultAddress);
    } catch (error) {
      console.log(error);
      console.log("connect your wallet");
    }
    const signer = await provider.getSigner();
    const contractAddress = "0xB620725c9E84B31079E321663A46E6b0efF9CBFc"; //0xe4e430285D4E1a42DCC3bBa6BF0a4790040C7624
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.connexion(resultAddress, timer);
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Transaction successful");
    } catch (error) {
      console.error("Error executing function:", error);
    }
  };

  const onTextAddress = (e) => {
    setSecondAddress(e.target.value);
    console.log(e.target.value);
  };

  const onTextChange = (e) => {
    console.log(e.target.value);

    setTimer(e.target.value);
  };

  return (
    <div className="  flex flex-col items-center justify-center w-1/3 bg-white text-gray-800 p-6 rounded-lg shadow-black shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Start 2FA</h2>
      <input
        type="text"
        value={SecondAddress}
        onChange={(e) => {
          onTextAddress(e);
        }}
        placeholder={"enter verifier Address"}
        className="px- py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
      ></input>
        <input
        type="number"
        value={timer}
        onChange={(e) => {
          onTextChange(e);
        }}
        placeholder={"enter during timer password"}
        className="px- py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
      ></input>
      <button
        className="flex items-center justify-center mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        onClick={(e) => {
          onButtonclick(e);
        }}
      >
        Start
      </button>
    </div>
  );
}

export default GenerateStealthAddress;
