import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";

// Wrap the entire app with ThirdwebProvider so the ConnectWallet is available.
// Optimism Mainnet chain ID is 10.
ReactDOM.render(
  <ThirdwebProvider desiredChainId={10}>
    <App />
  </ThirdwebProvider>,
  document.getElementById("root")
);