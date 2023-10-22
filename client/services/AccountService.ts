import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const getProvider = () => {
  if (typeof window.ethereum !== "undefined") {
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    throw new Error("Please install MetaMask to use this application.");
  }
};

const getSigner = async () => {
  const provider = getProvider();
  const accounts = await provider.send("eth_accounts", []);
  if (accounts.length > 0) {
    return provider.getSigner();
  }
  return null;
};

export default {
  getProvider: () => getProvider(),
  getSigner: () => getSigner(),
};
