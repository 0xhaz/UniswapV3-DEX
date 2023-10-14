import { useState } from "react";
import AccountService from "../services/AccountService";

const useMetaMask = () => {
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const connectMetaMask = async () => {
    const { signer, walletAddress } = await AccountService.connectWallet();

    setSigner(signer);
    setWalletAddress(walletAddress);
  };

  const tryConnectingMetaMask = async () => {
    const { signer, walletAddress } = await AccountService.getAccountData();

    setSigner(signer);
    setWalletAddress(walletAddress);
  };

  return {
    signer,
    walletAddress,
    connectMetaMask,
    tryConnectingMetaMask,
  };
};

export default useMetaMask;
