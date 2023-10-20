// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "../interface/IERC20.sol";
import "../interface/IMasterChef.sol";
import "../core/MasterChef.sol";

contract MasterChefFactory {
    address[] public allStakingPools;
    address public masterChef;

    constructor(address _masterChef) {
        masterChef = _masterChef;
    }

    function createStakingPool(
        address _lpToken,
        uint256 _allocPoint,
        uint256 _rewardPerBlock,
        uint256 _startBlock,
        uint256 _multiplierNumber
    ) external returns (address) {
        require(
            msg.sender == masterChef,
            "MasterChefFactory::createStakingPool::only masterchef"
        );
        require(
            _lpToken != address(0),
            "MasterChefFactory::createStakingPool::lpToken is zero address"
        );
        require(
            _allocPoint > 0,
            "MasterChefFactory::createStakingPool::allocPoint is zero"
        );
        require(
            _rewardPerBlock > 0,
            "MasterChefFactory::createStakingPool::rewardPerBlock is zero"
        );
        require(
            _startBlock > block.number,
            "MasterChefFactory::createStakingPool::startBlock is zero"
        );

        address stakingPool = address(
            new MasterChef(
                masterChef,
                _lpToken,
                _allocPoint,
                _rewardPerBlock,
                _startBlock,
                _multiplierNumber
            )
        );
        allStakingPools.push(stakingPool);

        return stakingPool;
    }

    function getAllStakingPools() external view returns (address[] memory) {
        return allStakingPools;
    }
}
