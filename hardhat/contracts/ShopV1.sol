// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/ILandz.sol";
import "./interfaces/ITowerz.sol";

contract ShopV1 {

  ILandz public landsContract;
  ITowerz public towersContract;

  uint256 landPrice = 0.001 ether;

  error ValueIncorrect();

  constructor(address _landsContract, address _towersContract) {
        landsContract = ILandz(_landsContract);
        towersContract = ITowerz(_towersContract);
    }

   function purchaseCombo(uint256 _mapId, uint256 _landId) external payable {
        if (msg.value != landPrice) revert ValueIncorrect();
        landsContract.mint(msg.sender, _mapId, _landId);
        towersContract.mint(msg.sender, 1);
   }
}