// src/components/MintNFT.tsx
import React from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useAddress } from "thirdweb/react";
import contractAbi from "../contractAbi.json"; // Ensure this file contains your contract ABI

// Use your provided contract address.
const CONTRACT_ADDRESS = "0xfA2A3452D86A9447e361205DFf29B1DD441f1821";

interface MintNFTProps {
  metadataUri: string; // The IPFS metadata URI (e.g., ipfs://<CID>)
  narrativePath: string; // The narrative path chosen by the user (e.g., "A", "B", or "C")
}

const MintNFT: React.FC<MintNFTProps> = ({ metadataUri, narrativePath }) => {
  const address = useAddress();
  const { mutate: sendTransaction, isLoading } = useSendTransaction();

  const handleMint = () => {
    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    // Prepare the contract call to your mintNFT function.
    // Function signature: mintNFT(address to, string finalURI, string path)
    const transaction = prepareContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractAbi: contractAbi,
      method: "mintNFT",
      params: [address, metadataUri, narrativePath],
    });

    sendTransaction(transaction, {
      onSuccess: (tx) => {
        alert("NFT minted successfully!");
      },
      onError: (error) => {
        console.error("Minting error:", error);
        alert("Minting failed");
      },
    });
  };

  return (
    <button onClick={handleMint} disabled={isLoading}>
      {isLoading ? "Minting..." : "Mint NFT"}
    </button>
  );
};

export default MintNFT;