export const GamezAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_landsContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "_towersContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_landId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_towerId",
        type: "uint256",
      },
    ],
    name: "Staking",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_landId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_towerId",
        type: "uint256",
      },
    ],
    name: "Unstaking",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getStakedTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "stakedLandz",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "stakedTowerz",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "landToTower",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "landsContract",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_landId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_towerId",
        type: "uint256",
      },
    ],
    name: "stakeLandAndTower",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "towersContract",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_landId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_towerId",
        type: "uint256",
      },
    ],
    name: "unstakeLandAndTower",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
