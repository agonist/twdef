// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Land contract for Tower Defense game
// Can manage multiple map with multiple lands
contract Land is ERC721Enumerable, Ownable {

    struct LandData {
        uint256 id;
        uint128 x;
        uint128 y;
        uint64 biome;
        uint64 dps;
        bool minted;
    }

    error AlreadyMinted();
    error ValueIncorrect();

    string public baseTokenURI;

    // mapId => tokenId => lands coordinates
    mapping(uint256 => mapping(uint256 => LandData)) public lands;

    uint256 landPrice = 1 ether;

    constructor() ERC721("Land", "LAND") {}

    function mint(uint256 _mapId, uint256 _landId) external payable {
        if (lands[_mapId][_landId].minted) revert AlreadyMinted();
        if (msg.value != landPrice) revert ValueIncorrect();

        // add some random effects like dps => chainlink

        lands[_mapId][_landId].minted = true;
        _mint(msg.sender, _landId);
    }

    function createMap(uint256 _mapId, LandData[] calldata _landsToMint)
        external
        onlyOwner
    {
        for (uint i = 0; i < _landsToMint.length; i++) {
            lands[_mapId][_landsToMint[i].id] = _landsToMint[i];
        }
    }

    function landInfo(uint256 _mapId, uint256 _landId)
        external
        view
        returns (LandData memory)
    {
        return lands[_mapId][_landId];
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

    function isMinted(uint256 _mapId, uint256 _landId)
        external
        view
        returns (bool)
    {
        return lands[_mapId][_landId].minted;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }
}
