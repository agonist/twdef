export const ShopV1Abi = [
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
    inputs: [],
    name: "ValueIncorrect",
    type: "error",
  },
  {
    inputs: [],
    name: "landsContract",
    outputs: [
      {
        internalType: "contract ILandz",
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
        internalType: "uint256",
        name: "_mapId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_landId",
        type: "uint256",
      },
    ],
    name: "purchaseCombo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "towersContract",
    outputs: [
      {
        internalType: "contract ITowerz",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
