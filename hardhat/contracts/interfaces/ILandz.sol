// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface ILandz {
    function mint(address _to, uint256 _mapId, uint256 _landId) external;
}
