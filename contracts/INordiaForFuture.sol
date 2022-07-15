// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INordiaForFuture {
    function mint(address minter) external;
    function totalSupply() external view returns (uint256);
}