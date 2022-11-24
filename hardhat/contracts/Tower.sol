// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tower is ERC721Enumerable, Ownable {
 
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string public baseTokenURI;

    struct Towerz {
        uint256 typez;
        uint256 level;
    }

    mapping(uint256 => Towerz) public towerz;

    constructor() ERC721("Towerz", "TOWZ") {}

    function mint(uint256 _type, uint256 _amount) external payable {
        for (uint256 i = 0; i < _amount; i++) {
            uint256 mintIndex = _tokenIds.current() + 1;
            _mint(msg.sender, mintIndex);
            towerz[mintIndex] = Towerz(_type, 1);
            _tokenIds.increment();
        }
    }

    function upgradeTower(uint256 _id) external {}

    function _balanceByIdOf(address _address)
        internal
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(_address);

        uint256[] memory ids = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(_address, i);
            ids[i] = tokenId;
        }
        return ids;
    }

    function balanceByIdOf(address _address)
        external
        view
        returns (uint256[] memory)
    {
        return _balanceByIdOf(_address);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }
    
}
