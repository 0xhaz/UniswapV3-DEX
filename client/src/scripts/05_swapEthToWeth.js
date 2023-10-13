require("dotenv").config();

const erc20Abi = require("../abis/erc20.json");

const hardhat = require("hardhat");
const provider = hardhat.ethers.provider;
const RECIPIENT = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

const wethContract = new hardhat.ethers.Contract(
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  erc20Abi,
  provider
);

const usdcContract = new hardhat.ethers.Contract(
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  erc20Abi,
  provider
);

const logBalances = async () => {
  const ethBalance = await provider.getBalance(RECIPIENT);
  const wethBalance = await wethContract.balanceOf(RECIPIENT);
  const usdcBalance = await usdcContract.balanceOf(RECIPIENT);
  console.log("ethBalance", hardhat.ethers.utils.formatEther(ethBalance));
  console.log("wethBalance", hardhat.ethers.utils.formatEther(wethBalance));
  console.log("usdcBalance", hardhat.ethers.utils.formatUnits(usdcBalance, 6));
};

const main = async () => {
  const inputAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // WETH
  const inputDecimals = 18;
  const signer = await hardhat.ethers.getImpersonatedSigner(RECIPIENT);

  console.log("-------------------- Time 0");
  await logBalances();

  const tokensIn = "3";
  const amountIn = hardhat.ethers.utils.parseUnits(tokensIn, inputDecimals);

  const params = {
    to: inputAddress,
    value: amountIn,
  };
  const tx = await signer.sendTransaction(params);
  await tx.wait();

  console.log("-------------------- Time 1");
  await logBalances();
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
