// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../library/SafeMath.sol";

contract RToken is ERC20, ERC20Burnable, AccessControl {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;

    mapping(address => uint256) private s_balances;

    uint256 private s_totalSupply;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    constructor() ERC20("Reward Token", "RToken") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    function mint(address _to, uint256 amount) external {
        require(hasRole(MANAGER_ROLE, _msgSender()), "Caller is not a manager");

        s_totalSupply = s_totalSupply.add(amount);
        s_balances[_to] = s_balances[_to].add(amount);

        _mint(_to, amount);
    }

    function safeTransferToken(address _to, uint256 _amount) external {
        require(hasRole(MANAGER_ROLE, _msgSender()), "Caller is not a manager");
        uint256 balance = balanceOf(address(this));
        if (_amount > balance) {
            transfer(_to, balance);
        } else {
            transfer(_to, _amount);
        }
    }
}
