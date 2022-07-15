// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./INordiaForFuture.sol";

contract OGSale is Context, Ownable {
    
    INordiaForFuture public nftContract;    

    mapping(address => uint8) public claimCnts; 
    uint256 public constant maxSaleCnt = 2000;
    constructor() {

    }
    receive() external payable { }
    function setNFTContract(address account) external onlyOwner {
        nftContract = INordiaForFuture(account);
    }

    function claimNft() external payable {
        require(nftContract.totalSupply() < 2000, "Sale ended");
        require(claimCnts[msg.sender] < 2, "Only 2 nfts available per wallet");
        require(msg.value == 0.075 ether, "Not enough eth");
        claimCnts[msg.sender] ++;
        nftContract.mint(msg.sender);
    }

    function claim() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        success;
    }

}
