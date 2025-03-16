import React, { useState } from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
// We'll add the mint popup component later. For now, it's a placeholder.
import MintPopup from "./components/MintPopup";

const App: React.FC = () => {
  // State for controlling the visibility of the MintNFT popup.
  const [isMintPopupVisible, setIsMintPopupVisible] = useState(false);
  const [narrative, setNarrative] = useState<string>("");

  // Function to trigger narrative generation and then show the mint popup.
  const triggerMint = () => {
    // For now, we set a placeholder narrative.
    setNarrative("This is your dynamic narrative text for the NFT.");
    setIsMintPopupVisible(true);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Don't Kill The Jam</h1>
        {/* ThirdwebConnect is provided via the ThirdwebProvider in index.tsx */}
        <ConnectWallet />
      </header>
      <main>
        <button onClick={triggerMint}>Generate Narrative & Mint NFT</button>
      </main>
      {isMintPopupVisible && (
        <MintPopup
          narrative={narrative}
          onClose={() => setIsMintPopupVisible(false)}
        />
      )}
    </div>
  );
};

export default App;