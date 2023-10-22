import { ethers } from "ethers";

const weiToTokenAmount = (amount: string, decimals: number) =>
  ethers.formatUnits(amount, decimals);

export default {
  decimalToPercent: (decimalValue: number, decimalPlaces: number = 3) =>
    (decimalValue * 100).toFixed(decimalPlaces),

  sqrtToPrice: (
    sqrt: number,
    token0Decimals: number,
    token1Decimals: number,
    token0IsInput: boolean = true
  ) => {
    const numerator = sqrt ** 2;
    const denominator = 2 ** 192;
    let ratio = numerator / denominator;
    const decimalDifference = token0Decimals - token1Decimals;
    const decimalShift = Math.pow(10, decimalDifference);
    ratio = ratio * decimalShift;
    if (!token0IsInput) {
      ratio = 1 / ratio;
    }
    return ratio;
  },

  deadlineFromMinutes: (minutes: number) =>
    Math.floor(Date.now() / 1000 + minutes * 60),

  tokensToWei: (inputAmount: string, inputDecimals: number) =>
    ethers.parseUnits(inputAmount, inputDecimals),

  hexToHumanAmount: (
    amount: string,
    decimals: number = 18,
    maxDecimals: number = 5
  ) => {
    if (!amount) {
      return "-";
    }

    return parseFloat(
      Number(weiToTokenAmount(amount.toString(), decimals))?.toFixed(
        maxDecimals
      )
    );
  },

  validateInputs: (
    inputSymbol: string,
    outputSymbol: string,
    inputAmount: number
  ) => {
    if (inputSymbol === outputSymbol) return;
    if (["", null].includes(inputSymbol)) return;
    if (["", null].includes(outputSymbol)) return;
    if (Number(inputAmount) === 0) return;

    return true;
  },

  ethToWethString: (inputSymbol: string, outputSymbol: string) => {
    if (inputSymbol === "ETH") {
      inputSymbol = "WETH";
    }
    if (outputSymbol === "ETH") {
      outputSymbol = "WETH";
    }
    return { inputSymbol, outputSymbol };
  },

  isSymbolsEthAndWeth: (input: string, output: string) => {
    return ["WETH", "ETH"].includes(input) && ["WETH", "ETH"].includes(output);
  },
};
