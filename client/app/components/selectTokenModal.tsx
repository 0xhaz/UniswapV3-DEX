import React from "react";

const SelectTokenModal = ({
  setInputSymbol,
  setOutputSymbol,
  isInput,
  onClose,
}) => {
  const setToken = (symbol: string) =>
    isInput ? setInputSymbol(symbol) : setOutputSymbol(symbol);
  return <div>selectTokenModal</div>;
};

export default SelectTokenModal;
