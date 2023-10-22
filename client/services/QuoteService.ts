import Utils from "@/utils/Utils";
import tokenList from "@/constants/tokenList.json";
import { getQuoter } from "./ContractService";

export const getQuote = async (
  inputAmount: string,
  inSymbol: string,
  outSymbol: string
) => {
  if (Utils.isSymbolsEthAndWeth(inSymbol, outSymbol)) {
    return inputAmount;
  }

  const { inputSymbol, outputSymbol } = Utils.ethToWethString(
    inSymbol,
    outSymbol
  );

  const token0 = tokenList.find(token => token.ticker === inputSymbol);
  const token1 = tokenList.find(token => token.ticker === outputSymbol);

  const amountIn = Utils.tokensToWei(
    inputAmount.toString(),
    token0?.decimals || 18
  );

  const quoterContract = getQuoter();

  const quote = await quoterContract.quoteExactInputSingle(
    token0?.address,
    token1?.address,
    "3000",
    amountIn,
    0
  );

  return Utils.hexToHumanAmount(quote, token1?.decimals);
};
