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
const uniContract = new hardhat.ethers.Contract(
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
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
  const uniBalance = await uniContract.balanceOf(RECIPIENT);
  console.log("ethBalance", hardhat.ethers.utils.formatEther(ethBalance));
  console.log("wethBalance", hardhat.ethers.utils.formatEther(wethBalance));
  console.log("usdcBalance", hardhat.ethers.utils.formatUnits(usdcBalance, 6));
  console.log("uniBalance", hardhat.ethers.utils.formatUnits(uniBalance, 18));
};

const main = async () => {
  const wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // WETH
  const inputDecimals = 18;
  const uniAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC
  const uniDecimals = 6;
  const fee = 500;
  const deadline = Math.floor(Date.now() / 1000 + 60 * 10); // 10 minutes from now
  const signer = await hardhat.ethers.getImpersonatedSigner(RECIPIENT);

  const approveTokens = "100";
  const approveIn = hardhat.ethers.utils.parseUnits(approveTokens, uniDecimals);
  await uniContract
    .connect(signer)
    .approve(swapRouterContract.address, approveIn);

  console.log("-------------------- Time 0");
  await logBalances();

  const params1 = {
    tokenIn: uniAddress,
    tokenOut: wethAddress,
    recipient: swapRouterContract.address,
    deadline,
    amountIn: approveIn,
    fee,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  const encodedTx1 = swapRouterContract.interface.encodeFunctionData(
    "exactInputSingle",
    [params1]
  );

  const amountMinimum = 0;
  const encodedTx2 = swapRouterContract.interface.encodeFunctionData(
    "unwrapWETH9",
    [amountMinimum, RECIPIENT]
  );

  const calls = [encodedTx1, encodedTx2];
  const encMultiCall = swapRouterContract.interface.encodeFunctionData(
    "multicall",
    [calls]
  );

  const txParams = {
    to: swapRouterContract.address,
    from: RECIPIENT,
    data: encMultiCall,
    gasLimit: 1_000_000,
  };

  const tx = await signer.sendTransaction(txParams);
  await tx.wait();

  console.log("-------------------- Time 1");
  await logBalances();
};
