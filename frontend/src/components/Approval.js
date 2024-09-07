import React, { useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import { contractABI } from "../Abi/Abi";

function Approval() {

  const onButtonclick = async (e) => {
    e.preventDefault();
    const provider = new BrowserProvider(window.ethereum);
 
    const signer = await provider.getSigner();
    const contractAddress = "0xB620725c9E84B31079E321663A46E6b0efF9CBFc"; //0xe4e430285D4E1a42DCC3bBa6BF0a4790040C7624
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.requestTwoFactor();
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Transaction successful");
    } catch (error) {
      console.error("Error executing function:", error);
    }

    //setDecrypted(plaintext);
  };



  return (
    <div className="flex flex-col items-center justify-center w-1/3 bg-white text-gray-800 p-6 rounded-lg shadow-black shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Request 2FA</h2>
      <button
        className="flex items-center justify-center mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        onClick={(e) => {
          onButtonclick(e);
        }}
      >
        Approval
      </button>
    </div>
  );
}

export default Approval;
