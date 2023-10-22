import { ethers } from "ethers";
import {
  contracts,
  ERC20ABI,
  PoolArtifact,
  Quoter2Artifact,
  QuoterArtifact,
  SwapRouterArtifact,
  WethArtifact,
} from "../constants/index";
import tokenList from "../constants/tokenList.json";
import AccountService from "./AccountService";

export const getSwapRouter = () => {
  return new ethers.Contract(
    contracts.SWAPROUTER.address,
    SwapRouterArtifact.abi,
    AccountService.getProvider()
  );
};

export const getQuoter = () => {
  return new ethers.Contract(
    contracts.QUOTER.address,
    QuoterArtifact.abi,
    AccountService.getProvider()
  );
};

export const getQuoter2 = () => {
  return new ethers.Contract(
    contracts.QUOTER2.address,
    Quoter2Artifact.abi,
    AccountService.getProvider()
  );
};

export const getPool = (poolAddress: string) => {
  return new ethers.Contract(
    poolAddress,
    PoolArtifact.abi,
    AccountService.getProvider()
  );
};

export const getToken = (ticker: string) => {
  const token = tokenList.find(token => token.ticker === ticker);
  const abi = ticker === "WETH" ? WethArtifact.abi : ERC20ABI;

  if (!token) {
    throw new Error("Token not found");
  }

  return new ethers.Contract(token.address, abi, AccountService.getProvider());
};
