import type { Metadata } from "next";
import "./globals.css";
import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/services/provider";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { Header } from "./components";

export const metadata: Metadata = {
  title: "Uniswap V3 dApp",
  description: "Uniswap V3 DEX with Staking and Liquidity Mining",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <Header />
            <div className="App">{children}</div>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
