// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "./SafeMath.sol";
import "../interface/IERC20.sol";
import "../interface/IMasterChef.sol";

library MasterChefLibrary {
    using SafeMath for uint256;

    function getMultiplier(
        uint256 _from,
        uint256 _to,
        uint256 _multiplierNumber
    ) internal pure returns (uint256) {
        return _to.sub(_from).mul(_multiplierNumber);
    }

    function safeTransfer(
        IERC20 _token,
        address _to,
        uint256 _amount
    ) internal {
        _token.transfer(_to, _amount);
    }

    function safeTransferFrom(
        IERC20 _token,
        address _from,
        address _to,
        uint256 _amount
    ) internal {
        _token.transferFrom(_from, _to, _amount);
    }

    function calculateTokenReward(
        uint256 _lastRewardBlock,
        uint256 _currentBlock,
        uint256 _rewardPerBlock,
        uint256 _allocPoint,
        uint256 _totalAllocation
    ) internal pure returns (uint256) {
        if (_currentBlock <= _lastRewardBlock) {
            return 0;
        }

        uint256 multiplier = _currentBlock.sub(_lastRewardBlock);
        uint256 tokenReward = multiplier
            .mul(_rewardPerBlock)
            .mul(_allocPoint)
            .div(_totalAllocation);

        return tokenReward;
    }
}
