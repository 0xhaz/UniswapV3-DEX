import { useState } from "react";

const useAmount = () => {
  const [inputAmount, _setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");

  const setInputAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let amount = e.target.value;

    if (amount === ".") {
      amount = "0.";
    }

    if (
      (!isNaN(parseFloat(amount)) && isFinite(Number(amount))) ||
      [0, "", null].includes(amount)
    ) {
      _setInputAmount(amount);
    }
  };

  return { inputAmount, outputAmount, setInputAmount, setOutputAmount };
};

export default useAmount;
