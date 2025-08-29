// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

contract GreenCredit is ERC20, AccessControl {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    uint public constant HYDROGEN_PER_CREDIT = 100;

    event CreditsIssued(address indexed producer, address indexed to, uint amount);
    event CreditsBurned(address indexed buyer, uint amount);

    constructor() ERC20("Green Hydrogen Credit", "GHC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // deployer = admin
    }

    // Producer creates credits and sends them to an address
    function issue(address to, uint256 amount) external onlyRole(PRODUCER_ROLE) {
        _mint(to, amount);
        emit CreditsIssued(msg.sender, to, amount);
    }

    // Buyer burns credits (when hydrogen is used)
    function useCredits(uint256 amount) external {
        _burn(msg.sender, amount);
        emit CreditsBurned(msg.sender, amount);
    }

    // Helper: hydrogen equivalent
    function hydrogenFromCredits(uint256 credits) public pure returns (uint256) {
        return credits * HYDROGEN_PER_CREDIT;
    }
}
