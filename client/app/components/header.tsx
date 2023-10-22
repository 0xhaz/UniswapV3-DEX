"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import Eth from "../../public/assets/eth.svg";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Header: React.FC = () => {
  const { address } = useAccount();

  const notifyConnectWallet = () => {
    toast.error("Connect Wallet", { duration: 2000 });
  };

  useEffect(() => {
    if (!address) notifyConnectWallet();
  }, [address]);

  return (
    <header>
      <div className="leftH">
        <Image src={Eth} alt="eth" width={50} height={50} className="logo" />
        <div className="headerItem">
          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Swap
          </Link>
        </div>
        <div className="headerItem">
          <Link
            href="/pool"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Pool
          </Link>
        </div>
        <div className="headerItem">
          <Link
            href="/farm"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Farms
          </Link>
        </div>
      </div>
      <div className="rightH">
        <div>
          <ConnectButton accountStatus={"full"} />
        </div>
      </div>

      <Toaster />
    </header>
  );
};

export default Header;
