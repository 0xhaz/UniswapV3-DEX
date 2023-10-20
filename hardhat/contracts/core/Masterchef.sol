// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../token/RToken.sol";
import "../library/SafeMath.sol";
import "../library/MasterChefLibrary.sol";

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

    RToken public s_rewardToken;
    address public s_devAddress;
    uint256 public s_rewardTokenPerBlock;

    /// @notice Id of pool
    mapping(uint256 => mapping(address => UserInfo)) public s_userInfo;

    PoolInfo[] public s_poolInfo;
    uint256 public s_totalAllocation = 0;
    uint256 public startBlock;
    uint256 public BONUS_MULTIPLIER;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    modifier validatePool(uint256 _pid) {
        require(_pid < s_poolInfo.length, "MasterChef: pool exists");
        _;
    }

    constructor(
        RToken _rewardToken,
        address _devAddress,
        uint256 _rewardTokenPerBlock,
        uint256 _startBlock,
        uint256 _bonusMultiplier
    ) Ownable(msg.sender) {
        s_devAddress = _devAddress;
        s_rewardTokenPerBlock = _rewardTokenPerBlock;
        startBlock = _startBlock;
        BONUS_MULTIPLIER = _bonusMultiplier;

        s_poolInfo.push(
            PoolInfo({
                lpToken: _rewardToken,
                allocPoint: 10000, // 10%
                lastRewardBlock: _startBlock,
                rewardTokenPerShare: 0
            })
        );
        s_totalAllocation = 10000;
    }

    /**
     * @param _allocPoint  The allocation point of pool
     * @param _lpToken   The address of lp token contract
     * @notice Only owner can call this function
     * @notice This function will update the allocation point of pool
     */
    function addPool(uint256 _allocPoint, IERC20 _lpToken) public onlyOwner {
        checkPoolDuplicate(_lpToken);
        uint256 lastRewardBlock = block.number > startBlock
            ? block.number
            : startBlock;
        s_totalAllocation = s_totalAllocation.add(_allocPoint);
        s_poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                rewardTokenPerShare: 0
            })
        );
        _updateStakingPool();
    }

    function updatePool(uint256 _pid) public validatePool(_pid) {
        PoolInfo storage pool = s_poolInfo[_pid];

        uint256 tokenReward = MasterChefLibrary.calculateTokenReward(
            pool.lastRewardBlock,
            block.number,
            s_rewardTokenPerBlock,
            pool.allocPoint,
            s_totalAllocation
        );

        if (tokenReward > 0) {
            s_rewardToken.mint(s_devAddress, tokenReward.div(10));
            s_rewardToken.mint(address(this), tokenReward);
            pool.rewardTokenPerShare = pool.rewardTokenPerShare.add(
                tokenReward.mul(1e12).div(pool.lpToken.balanceOf(address(this)))
            );
            pool.lastRewardBlock = block.number;
        }
    }

    function massUpdatePools() public {
        uint256 length = s_poolInfo.length;
        for (uint256 pid = 0; pid < length; pid++) {
            updatePool(pid);
        }
    }

    function setPool(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }

        uint256 prevAllocPoint = s_poolInfo[_pid].allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
        if (prevAllocPoint != _allocPoint) {
            s_totalAllocation = s_totalAllocation.sub(prevAllocPoint).add(
                _allocPoint
            );
            _updateStakingPool();
        }
    }

    function stakePool(
        uint256 _pid,
        uint256 _amount
    ) public validatePool(_pid) {
        PoolInfo storage pool = s_poolInfo[_pid];
        UserInfo storage user = s_userInfo[_pid][msg.sender];
        updatePool(_pid);

        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(pool.rewardTokenPerShare)
                .div(1e12)
                .sub(user.pendingReward);
            if (pending > 0) {
                _safeTransfer(msg.sender, pending);
            }
        }

        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(
                address(msg.sender),
                address(this),
                _amount
            );
            user.amount = user.amount.add(_amount);
        }

        user.pendingReward = user.amount.mul(pool.rewardTokenPerShare).div(
            1e12
        );

        emit Deposit(msg.sender, _pid, _amount);
    }

    function unstakePool(
        uint256 _pid,
        uint256 _amount
    ) public validatePool(_pid) {
        PoolInfo storage pool = s_poolInfo[_pid];
        UserInfo storage user = s_userInfo[_pid][msg.sender];
        updatePool(_pid);

        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(pool.rewardTokenPerShare)
                .div(1e12)
                .sub(user.pendingReward);
            if (pending > 0) {
                _safeTransfer(msg.sender, pending);
            }
        }

        if (_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }

        user.pendingReward = user.amount.mul(pool.rewardTokenPerShare).div(
            1e12
        );

        emit Withdraw(msg.sender, _pid, _amount);
    }

    function autoCompound() public {
        PoolInfo storage pool = s_poolInfo[0];
        UserInfo storage user = s_userInfo[0][msg.sender];
        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(pool.rewardTokenPerShare)
                .div(1e12)
                .sub(user.pendingReward);
            if (pending > 0) {
                user.amount = user.amount.add(pending);
            }
        }
        user.pendingReward = user.amount.mul(pool.rewardTokenPerShare).div(
            1e12
        );
    }

    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = s_poolInfo[_pid];
        UserInfo storage user = s_userInfo[_pid][msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.pendingReward = 0;
    }

    function changeDev(address _dev) public onlyOwner {
        s_devAddress = _dev;
    }

    function pendingReward(
        uint256 _pid,
        address _user
    ) external view returns (uint256) {
        PoolInfo storage pool = s_poolInfo[_pid];
        UserInfo storage user = s_userInfo[_pid][_user];
        uint256 rewardTokenPerShare = pool.rewardTokenPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));

        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getBonusMultiplier(
                pool.lastRewardBlock,
                block.number
            );

            uint256 tokenReward = multiplier
                .mul(s_rewardTokenPerBlock)
                .mul(pool.allocPoint)
                .div(s_totalAllocation);

            rewardTokenPerShare = rewardTokenPerShare.add(
                tokenReward.mul(1e12).div(lpSupply)
            );
        }
        return
            user.amount.mul(rewardTokenPerShare).div(1e12).sub(
                user.pendingReward
            );
    }

    function poolLength() external view returns (uint256) {
        return s_poolInfo.length;
    }

    function getPoolInfo(uint256 _pid) public view returns (PoolInfo memory) {
        return s_poolInfo[_pid];
    }

    function getLPToken(uint256 _pid) public view returns (IERC20) {
        return s_poolInfo[_pid].lpToken;
    }

    function getAllocPoint(uint256 _pid) public view returns (uint256) {
        return s_poolInfo[_pid].allocPoint;
    }

    function getLastRewardBlock(uint256 _pid) public view returns (uint256) {
        return s_poolInfo[_pid].lastRewardBlock;
    }

    function getRewardTokenPerShare(
        uint256 _pid
    ) public view returns (uint256) {
        return s_poolInfo[_pid].rewardTokenPerShare;
    }

    /**
     * @param _from  The start block
     * @param _to  The end block
     * @notice This function will calculate the reward token that will be minted
     */

    function getBonusMultiplier(
        uint256 _from,
        uint256 _to
    ) public view returns (uint256) {
        return MasterChefLibrary.getMultiplier(_from, _to, BONUS_MULTIPLIER);
    }

    function updateMultiplier(uint256 _multiplierNumber) public onlyOwner {
        BONUS_MULTIPLIER = _multiplierNumber;
    }

    function checkPoolDuplicate(IERC20 _token) public view {
        uint256 length = s_poolInfo.length;
        for (uint256 _pid = 0; _pid < length; _pid++) {
            require(
                s_poolInfo[_pid].lpToken != _token,
                "MasterChef: pool already exist"
            );
        }
    }

    /// @notice Update allocation point of pool based on pool id
    function _updateStakingPool() internal {
        uint256 length = s_poolInfo.length;
        uint256 points = 0;
        for (uint256 pid = 1; pid < length; pid++) {
            points = points.add(s_poolInfo[pid].allocPoint);
        }
        if (points != 0) {
            points = points.div(3);
            s_totalAllocation = s_totalAllocation
                .sub(s_poolInfo[0].allocPoint)
                .add(points);
            s_poolInfo[0].allocPoint = points;
        }
    }

    function _safeTransfer(address _to, uint256 _amount) internal {
        s_rewardToken.safeTransferToken(_to, _amount);
    }
}
