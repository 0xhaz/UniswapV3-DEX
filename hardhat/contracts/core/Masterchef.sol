// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../token/RToken.sol";
import "../library/SafeMath.sol";

contract MasterChefV1 is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /**
     * @dev address of staker
     * @dev amount of staker will determine the rewardTokenPerShare
     * @dev pendingReward is the reward that staker will get after harvest
     * @dev the amount of staker will be determine by pool id
     */

    struct UserInfo {
        uint256 amount;
        uint256 pendingReward;
    }

    struct PoolInfo {
        IERC20 lpToken;
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 rewardTokenPerShare;
    }

    RToken public rewardToken;
    address public devAddress;
    uint256 public rewardTokenPerBlock;

    /// @notice Id of pool
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

    PoolInfo[] public poolInfo;
    uint256 public totalAllocation = 0;
    uint256 public startBlock;
    uint256 public BONUS_MULTIPLIER;

    constructor(
        RToken _rewardToken,
        address _devAddress,
        uint256 _rewardTokenPerBlock,
        uint256 _startBlock,
        uint256 _bonusMultiplier
    ) Ownable(msg.sender) {
        devAddress = _devAddress;
        rewardTokenPerBlock = _rewardTokenPerBlock;
        startBlock = _startBlock;
        BONUS_MULTIPLIER = _bonusMultiplier;

        poolInfo.push(
            PoolInfo({
                lpToken: _rewardToken,
                allocPoint: 10000, // 10%
                lastRewardBlock: _startBlock,
                rewardTokenPerShare: 0
            })
        );
        totalAllocation = 10000;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    function getPoolInfo(uint256 _pid) public view returns (PoolInfo memory) {
        return poolInfo[_pid];
    }

    function getMultiplier(
        uint256 _from,
        uint256 _to
    ) public view returns (uint256) {
        return _to.sub(_from).mul(BONUS_MULTIPLIER);
    }

    function updateMultiplier(uint256 _multiplierNumber) public onlyOwner {
        BONUS_MULTIPLIER = _multiplierNumber;
    }
}
