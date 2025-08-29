// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GreenCredit is ERC20, AccessControl {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    event CreditsIssued(address indexed producer, address indexed buyer, uint256 amount);
    event CreditsBurned(address indexed buyer, uint256 amount);

    constructor() ERC20("GreenCredit", "GC") {
        // The deployer (msg.sender) gets admin role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Producer issues credits to a buyer
    function issue(address buyer, uint256 amount) external onlyRole(PRODUCER_ROLE) {
        require(hasRole(BUYER_ROLE, buyer), "Recipient must be a Buyer");
        _mint(buyer, amount);
        emit CreditsIssued(msg.sender, buyer, amount);
    }

    /// @notice Buyer burns credits when they use hydrogen
    function useCredits(uint256 amount) external onlyRole(BUYER_ROLE) {
        _burn(msg.sender, amount);
        emit CreditsBurned(msg.sender, amount);
    }

    /// @notice Auditor can see balances (read-only, no role restriction required here)
    function getBalance(address account) external view returns (uint256) {
        return balanceOf(account);
    }
}
