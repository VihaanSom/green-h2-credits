// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GreenCredit {
    uint public totalCredits; // how many credits exist

    // Issue new credits
    function issue(uint amount) public {
        totalCredits += amount;
    }
}
