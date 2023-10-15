// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

interface IRToken {
    function mint(address _to, uint256 amount) external;

    function safeTransferToken(address _to, uint256 _amount) external;
}
