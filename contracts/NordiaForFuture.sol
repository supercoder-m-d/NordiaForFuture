// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "erc721a/contracts/ERC721A.sol";

contract NordiaForFuture is ERC721A {
  using Strings for uint256;
  string public baseURI;
  mapping (address => bool) controllers;

  constructor() ERC721A("NordiaForFuture", "NFF") {
    controllers[msg.sender] = true;
  }
  modifier hasRole() {
    require(controllers[msg.sender], "Not admin");
    _;
  }
  function setRole(address account) external hasRole {
    controllers[account] = true;
  }
  function removeRole(address account) external hasRole {
    controllers[account] = false;
  }

  function mint(address account, uint256 quantity) external hasRole {
      // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
      _mint(account, quantity);
  }
  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721A)
    returns (string memory)
  {
    require(_exists(tokenId), "Cannot query non-existent token");
    
    return string(abi.encodePacked(baseURI, tokenId.toString()));
  }
  function setBaseURI(string memory uri) external hasRole {
    baseURI = uri;
  }
}
