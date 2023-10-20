// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

interface IMasterChef {
    function userInfo(
        uint256 _pid,
        address _user
    ) external view returns (uint256, uint256);

    function deposit(uint256 _pid, uint256 _amount) external;

    function withdraw(uint256 _pid, uint256 _amount) external;

    function emergencyWithdraw(uint256 _pid) external;

    function updatePool(uint256 _pid) external;

    function poolLength() external view returns (uint256);

    function getPoolInfo(
        uint256 _pid
    ) external view returns (address, uint256, uint256, uint256, uint256);

    function getMultiplier(
        uint256 _from,
        uint256 _to
    ) external view returns (uint256);

    function checkPoolDuplicate(address _lpToken) external view;

    function updateMultiplier(uint256 multiplierNumber) external;

    function changeDev(address _devaddr) external;

    function getPoolLength() external view returns (uint256);

    function getLPAddress(uint256 _pid) external view returns (address);

    function getAllocPoint(uint256 _pid) external view returns (uint256);

    function getLastRewardBlock(uint256 _pid) external view returns (uint256);

    function getRewardPerBlock(uint256 _pid) external view returns (uint256);
}
