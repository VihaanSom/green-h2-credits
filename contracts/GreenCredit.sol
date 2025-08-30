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

    struct Certificate {
        address producer;
        uint256 volume;
        bool approved;
        bool used;
    }

    mapping(uint256 => Certificate) public certificates;

    event CreditsIssued(address indexed producer, address indexed buyer, uint256 amount, uint256 certId);
    event CreditsBurned(address indexed buyer, uint256 amount);
    event CertificateApproved(address indexed certifier, uint256 certId, address producer, uint256 volume);
    event Paused(address regulator);
    event Unpaused(address regulator);

    constructor() ERC20("GreenCredit", "GC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier whenNotPaused() {
        require(!paused, "System is paused");
        _;
    }

    // === Certifier approves new certificate ===
    function approveCertificate(uint256 certId, address producer, uint256 volume) 
        external 
        onlyRole(CERTIFIER_ROLE) 
    {
        require(!certificates[certId].approved, "Certificate already approved");
        require(volume > 0, "Volume must be > 0");

        certificates[certId] = Certificate({
            producer: producer,
            volume: volume,
            approved: true,
            used: false
        });

        emit CertificateApproved(msg.sender, certId, producer, volume);
    }

    // === Producer issues credits tied to certificate ===
    function issue(uint256 certId, address buyer, uint256 amount) 
        external 
        onlyRole(PRODUCER_ROLE) 
        whenNotPaused 
    {
        Certificate storage cert = certificates[certId];
        require(cert.approved, "Certificate not approved");
        require(!cert.used, "Certificate already used");
        require(cert.producer == msg.sender, "Not certificate's producer");
        require(amount <= cert.volume, "Exceeds certified volume");
        require(hasRole(BUYER_ROLE, buyer), "Recipient must be Buyer");

        _mint(buyer, amount);
        cert.used = true; // 🔒 lock once issued
        emit CreditsIssued(msg.sender, buyer, amount, certId);
    }

    // === Buyer burns credits when using hydrogen ===
    function useCredits(uint256 amount) external onlyRole(BUYER_ROLE) whenNotPaused {
        _burn(msg.sender, amount);
        emit CreditsBurned(msg.sender, amount);
    }

    // === Auditor can view balances ===
    function getBalance(address account) external view returns (uint256) {
        return balanceOf(account);
    }

    // === Regulator controls system state ===
    function pause() external onlyRole(REGULATOR_ROLE) {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyRole(REGULATOR_ROLE) {
        paused = false;
        emit Unpaused(msg.sender);
    }
}
