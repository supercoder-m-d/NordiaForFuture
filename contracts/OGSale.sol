// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./INordiaForFuture.sol";

contract OGSale is Context, Ownable {
    
    bytes32 public merkleRoot;
    INordiaForFuture public nftContract;    

    mapping(address => uint8) public claimCnts; 
    uint256 public constant maxSaleCnt = 2000;
    constructor() {

    }
    receive() external payable { }
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }
    function setNFTContract(address account) external onlyOwner {
        nftContract = INordiaForFuture(account);
    }

    function claimNft(bytes32[] calldata _merkleProof) external payable {
        require(nftContract.totalSupply() < 2000, "Sale ended");
        require(claimCnts[msg.sender] < 2, "Only 2 nfts available per wallet");
        require(msg.value == 0.075 ether, "Not enough eth");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Invalid proof");
        claimCnts[msg.sender] ++;
        nftContract.mint(msg.sender, 1);
    }

    function claim() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        success;
    }

}
