require("dotenv").config();

const SwapRouterArtifact = require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json");
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
const swapRouterContract = new hardhat.ethers.Contract(
  "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  SwapRouterArtifact.abi,
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
  const outputAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC
  const outputDecimals = 6;
  const fee = 500;
  const deadline = Math.floor(Date.now() / 1000 + 60 * 10); // 10 minutes from now
  const signer = await hardhat.ethers.getImpersonatedSigner(RECIPIENT);

  console.log("-------------------- Time 0");
  await logBalances();

  const tokensIn = "1";
  const amountIn = hardhat.ethers.utils.parseUnits(tokensIn, inputDecimals);
  const paramsInput = {
    tokenIn: inputAddress,
    tokenOut: outputAddress,
    fee,
    recipient: RECIPIENT,
    deadline,
    amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  const txInput = await swapRouterContract
    .connect(signer)
    .exactInputSingle(paramsInput, {
      gasLimit: 1_000_000,
      value: amountIn,
    });
  await txInput.wait();

  console.log("-------------------- Time 1");
  await logBalances();
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
