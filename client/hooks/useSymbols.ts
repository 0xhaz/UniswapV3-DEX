import { useState } from "react";

const useSymbols = () => {
  const [inputSymbol, _setInputSymbol] = useState<string | null>("ETH");
  const [outputSymbol, _setOutputSymbol] = useState<string | null>("ETH");

  const setInputSymbol = (symbol: string) => {
    if (symbol === outputSymbol) {
      _setOutputSymbol(null);
    }
    _setInputSymbol(symbol);
  };

  const setOutputSymbol = (symbol: string) => {
    if (symbol === inputSymbol) {
      _setInputSymbol(null);
    }
    _setOutputSymbol(symbol);
  };

  return { inputSymbol, outputSymbol, setInputSymbol, setOutputSymbol };
};

export default useSymbols;
