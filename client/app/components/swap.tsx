"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../../constants/tokenList.json";

const Swap: React.FC = () => {
  const [slippage, setSlippage] = useState<number>(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState<number | null>(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState<number | null>(null);
  const [tokenOne, setTokenOne] = useState<any>(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState<any>(tokenList[1]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [changeToken, setChangeToken] = useState<number>(0);

  const handleSlippageChange = (e: any) => {
    setSlippage(e.target.value);
  };

  const changeAmount = (e: any) => {
    setTokenOneAmount(e.target.value);
  };

  const switchTokens = () => {
    setTokenOne(tokenTwo);
    setTokenTwo(tokenOne);
  };

  const openModal = (token: number) => {
    setIsOpen(true);
    setChangeToken(token);
  };

  const modifyToken = (index: number) => {
    if (changeToken === 1) {
      setTokenOne(tokenList[index]);
    } else {
      setTokenTwo(tokenList[index]);
    }
    setIsOpen(false);
  };

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e: any, i: number) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <Image
                  src={e.img}
                  alt={e.name}
                  width={20}
                  height={20}
                  className="tokenLogo"
                />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount || ""}
            onChange={changeAmount}
          />
          <Input placeholder="0" value={tokenTwoAmount || ""} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            <Image
              src={tokenOne.img}
              alt={tokenOne.name}
              width={20}
              height={20}
              className="assetLogo"
            />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            <Image
              src={tokenTwo.img}
              alt={tokenTwo.name}
              width={20}
              height={20}
              className="assetLogo"
            />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <button
          className="swapButton"
          disabled={!tokenOneAmount}
          onClick={() => {}}
        >
          Swap
        </button>
      </div>
    </>
  );
};

export default Swap;
