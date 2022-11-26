// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./lib/IERC4907.sol";

// Land contract for Tower Defense game
// Can manage multiple map with multiple lands
contract Landz is ERC721Enumerable, Ownable, IERC4907 {
    struct UserInfo {
        address user; // address of user role
        uint64 expires; // unix timestamp, user expires
    }
    mapping(uint256 => UserInfo) private _users;

    struct LandData {
        uint256 id;
        uint128 x;
        uint128 y;
        bool minted;
    }

    error AlreadyMinted();
    error ValueIncorrect();
    error MapNotCreated();
    error NotTheOwner();
    error UserAlreadyAssigned();
    error ExpireNotInTheFuture();

    string public baseTokenURI;

    // mapId => tokenId => lands coordinates
    mapping(uint256 => mapping(uint256 => LandData)) public lands;
    mapping(uint256 => bool) public mapCreated;

    uint256 landPrice = 1 ether;

    constructor() ERC721("Landz", "LANDZ") {}

    function mint(uint256 _mapId, uint256 _landId) external payable {
        if (!mapCreated[_mapId]) revert MapNotCreated();
        if (lands[_mapId][_landId].minted) revert AlreadyMinted();
        if (msg.value != landPrice) revert ValueIncorrect();

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
        mapCreated[_mapId] = true;
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

    // Lending stuff ERC-4907

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);
        if (
            from != to &&
            _users[tokenId].user != address(0) && //user still present
            block.timestamp >= _users[tokenId].expires // user expired
        ) {
            delete _users[tokenId];
            emit UpdateUser(tokenId, address(0), 0);
        }
    }

    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) public virtual override {
        if (!_isApprovedOrOwner(msg.sender, tokenId)) revert NotTheOwner();
        if (userOf(tokenId) != address(0)) revert UserAlreadyAssigned();
        if (expires < block.timestamp) revert ExpireNotInTheFuture();
        UserInfo storage info = _users[tokenId];
        info.user = user;
        info.expires = expires;
        emit UpdateUser(tokenId, user, expires);
    }

    function userOf(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        if (uint256(_users[tokenId].expires) >= block.timestamp) {
            return _users[tokenId].user;
        }
        return address(0);
    }

    function userExpires(uint256 tokenId)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _users[tokenId].expires;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IERC4907).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
