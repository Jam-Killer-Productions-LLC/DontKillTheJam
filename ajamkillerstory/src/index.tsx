import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThirdwebProvider, createClient } from "@thirdweb-dev/react";

// Create a Thirdweb client with your client ID and desired chain (Optimism Mainnet: chainId 10)
const client = createClient({
  clientId: "e24d90c806dc62cef0745af3ddd76314", // Your Thirdweb client ID
  desiredChainId: 10,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThirdwebProvider client={client}>
    <App />
  </ThirdwebProvider>
);