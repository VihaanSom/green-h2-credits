// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GreenCredit is ERC20, AccessControl {
    bytes32 public constant PRODUCER_ROLE   = keccak256("PRODUCER_ROLE");
    bytes32 public constant BUYER_ROLE      = keccak256("BUYER_ROLE");
    bytes32 public constant AUDITOR_ROLE    = keccak256("AUDITOR_ROLE");
    bytes32 public constant CERTIFIER_ROLE  = keccak256("CERTIFIER_ROLE");
    bytes32 public constant REGULATOR_ROLE  = keccak256("REGULATOR_ROLE");

    bool public paused = false;

    event CreditsIssued(address indexed producer, address indexed buyer, uint256 amount);
    event CreditsBurned(address indexed buyer, uint256 amount);
    event CertificateApproved(address indexed certifier, uint256 certId, address producer);
    event Paused(address regulator);
    event Unpaused(address regulator);

    mapping(uint256 => bool) public approvedCertificates;

    constructor() ERC20("GreenCredit", "GC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier whenNotPaused() {
        require(!paused, "System is paused");
        _;
    }

    function approveCertificate(uint256 certId, address producer) external onlyRole(CERTIFIER_ROLE) {
        require(!approvedCertificates[certId], "Already approved");
        approvedCertificates[certId] = true;
        emit CertificateApproved(msg.sender, certId, producer);
    }

    function issue(uint256 certId, address buyer, uint256 amount) 
        external 
        onlyRole(PRODUCER_ROLE) 
        whenNotPaused 
    {
        require(hasRole(BUYER_ROLE, buyer), "Recipient must be Buyer");
        require(approvedCertificates[certId], "Certificate not approved");
        _mint(buyer, amount);
        emit CreditsIssued(msg.sender, buyer, amount);
    }

    function useCredits(uint256 amount) external onlyRole(BUYER_ROLE) whenNotPaused {
        _burn(msg.sender, amount);
        emit CreditsBurned(msg.sender, amount);
    }

    function getBalance(address account) external view returns (uint256) {
        return balanceOf(account);
    }

    // Regulator powers
    function pause() external onlyRole(REGULATOR_ROLE) {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyRole(REGULATOR_ROLE) {
        paused = false;
        emit Unpaused(msg.sender);
    }
}
