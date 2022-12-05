// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITowerz.sol";

contract Towerz is ERC721Enumerable, Ownable, ITowerz {
 
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string public baseTokenURI;

    error Unhautorized();

    // id to type
    mapping(uint256 => uint256) public towerz;
    mapping(address => bool) minter;

    constructor() ERC721("Towerz", "TOWZ") {}

    function mint(address _to, uint256 _type, uint256 _amount) external {
        if (!minter[msg.sender]) revert Unhautorized();
        for (uint256 i = 0; i < _amount; i++) {
            uint256 mintIndex = _tokenIds.current() + 1;
            _mint(_to, mintIndex);
            towerz[mintIndex] = _type;
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

        function setMinter(address _address, bool _minter) external onlyOwner {
        minter[_address] = _minter;
    }
    
}
