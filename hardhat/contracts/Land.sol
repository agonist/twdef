// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Land is ERC721Enumerable, Ownable {
    struct LandCoord {
        uint256 id;
        uint128 x;
        uint128 y;
        bool minted;
    }

    error AlreadyMinted();
    error ValueIncorrect();

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public baseTokenURI;

    // tokenId => lands coordinates
    mapping(uint256 => LandCoord) public lands;
    uint256 landPrice = 1 ether;

    constructor() ERC721("Land", "LAND") {}

    function mint(uint256 landId) external payable {
        if (lands[landId].minted) revert AlreadyMinted();
        if (msg.value != landPrice) revert ValueIncorrect();

        lands[landId].minted = true;
        _mint(msg.sender, landId);
    }

    function mintLand(LandCoord[] calldata landsToMint) external onlyOwner {
        for (uint i = 0; i < landsToMint.length; i++) {
            uint256 newItemId = _tokenIds.current();
            _mint(msg.sender, newItemId);
            _tokenIds.increment();
        }
    }

    function uploadLandCoordinates(LandCoord[] calldata landsToMint)
        external
        onlyOwner
    {
        for (uint i = 0; i < landsToMint.length; i++) {
            lands[landsToMint[i].id] = landsToMint[i];
        }
    }

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

    function isMinted(uint256 landId) external view returns (bool) {
        return lands[landId].minted;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }
}
