// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Gamez is Ownable {
    struct Stacked {
        uint256[] landIds;
        uint256[] towersIds;
    }

    IERC721 public landsContract;
    IERC721 public towersContract;

    // land id => tower id
    mapping(uint256 => uint256) public landToTower;
    mapping(address => Stacked) stacked;

    event Staking(address from, uint256 _landId, uint256 _towerId);
    event Unstaking(address from, uint256 _landId, uint256 _towerId);

    constructor(address _landsContract, address _towersContract) {
        landsContract = IERC721(_landsContract);
        towersContract = IERC721(_towersContract);
    }

    function stakeLandAndTower(uint256 _landId, uint256 _towerId) external {
        //require(!stakingPaused, "Staking is currently paused.");
        Stacked storage staked = stacked[msg.sender];
        staked.landIds.push(_landId);
        landsContract.transferFrom(msg.sender, address(this), _landId);

        staked.towersIds.push(_towerId);
        towersContract.transferFrom(msg.sender, address(this), _towerId);

        landToTower[_landId] = _towerId;
        emit Staking(msg.sender, _landId, _towerId);
    }

    function unstakeLandAndTower(uint256 _landId, uint256 _towerId) external {
        // require(!stakingPaused, "Staking is currently paused.");
        Stacked storage staked = stacked[msg.sender];

        // land
        landsContract.transferFrom(address(this), msg.sender, _landId);

        uint256[] memory stakedLands = staked.landIds;
        uint256 index;
        for (uint256 i; i < stakedLands.length; i++) {
            if (stakedLands[i] == _landId) index = i;
        }
        if (stakedLands[index] == _landId) {
            staked.landIds[index] = stakedLands[staked.landIds.length - 1];
            staked.landIds.pop();
        }

        // tower
        towersContract.transferFrom(address(this), msg.sender, _towerId);

        uint256[] memory stakedTower = staked.towersIds;
        uint256 indexT;
        for (uint256 i; i < stakedTower.length; i++) {
            if (stakedTower[i] == _towerId) indexT = i;
        }
        if (stakedTower[indexT] == _towerId) {
            staked.towersIds[indexT] = stakedTower[staked.towersIds.length - 1];
            staked.towersIds.pop();
        }
        landToTower[_landId] = 0;
        emit Unstaking(msg.sender, _landId, _towerId);
    }
}
