require("dotenv").config();
const QuoterArtifact = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

const Quoter = async () => {
  const quoterContract = new ethers.Contract(
    "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    QuoterArtifact.abi,
    provider
  );

  const inputAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // WETH
  const inputDecimals = 18;
  const outputAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC
  const outputDecimals = 6;
  const fee = 3000;

  // quoterExactInputSingle
  const tokensIn = "1";
  const amountIn = ethers.utils.parseUnits(tokensIn, inputDecimals);
  const quote1 = await quoterContract.callStatic.quoteExactInputSingle(
    inputAddress,
    outputAddress,
    fee,
    amountIn,
    0
  );

  const formattedQuoteIn = ethers.utils.formatUnits(quote1, outputDecimals);
  console.log(`Swap ${tokensIn} WETH for ${formattedQuoteIn} USDC`);

  //   quoterExactOutputSingle
  const tokensOut = "2000";
  const amountOut = ethers.utils.parseUnits(tokensOut, outputDecimals);
  const quote2 = await quoterContract.callStatic.quoteExactOutputSingle(
    inputAddress,
    outputAddress,
    fee,
    amountOut,
    0
  );

  const formattedQuoteOut = ethers.utils.formatUnits(quote2, inputDecimals);
  console.log(`Swap ${formattedQuoteOut} WETH for ${tokensOut} USDC`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
