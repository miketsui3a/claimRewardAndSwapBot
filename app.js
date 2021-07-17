const Web3 = require("web3");
// const abiDecoder = require("abi-decoder");

// let web3 = new Web3("https://rpc-mainnet.matic.network");
let web3 = new Web3("http://127.0.0.1:8545");

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "director",
        type: "address",
      },
    ],
    name: "earned",
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
];

const swapAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapExactTokensForTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const erc20Abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

const boardroomAddr = "0x376d053876fdb5601cb87a342ee200e86704da62";
// const swapAddr = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";//sushuswap
const swapAddr = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; //quickswap
const myAddr = "0xd8aBbc1AAC264f84d3aae1e6E501fe8EC3EB99d1";
const yourPrivateKey = "";

async function main() {
  const contract = new web3.eth.Contract(abi, boardroomAddr);
  const swapContract = new web3.eth.Contract(swapAbi, swapAddr);
  const reward = await contract.methods.earned(myAddr).call();
  const erc20 = new web3.eth.Contract(
    erc20Abi,
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
  );
  while (true) {
    if (reward != 0) {
      console.log(reward);

      const claimRewardSigned = await web3.eth.accounts.signTransaction(
        {
          to: boardroomAddr,
          data: "0xb88a802f",
          gas: "5000000",
          gasPrice: "100000000000",
        },
        yourPrivateKey
      );

      console.log("before:  ", await erc20.methods.balanceOf(myAddr).call());

      const currentBlock = await web3.eth.getBlockNumber();

      const swapTx = await swapContract.methods.swapExactTokensForTokens(
        10000,
        0,
        [
          "0x3ae112f0ff3893c8e8675de170fd72406e9580f2",
          "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        ],
        myAddr,
        // currentBlock + 10
        99999999999
      );

      const nextNonce = await web3.eth.getTransactionCount(myAddr);
      const swapSigned = await web3.eth.accounts.signTransaction(
        {
          nonce: nextNonce + 1,
          to: swapAddr,
          data: swapTx.encodeABI(),
          gas: "5000000",
          gasPrice: "50000000000",
        },
        yourPrivateKey
      );

      const claimRewardPromise = web3.eth.sendSignedTransaction(
        claimRewardSigned.rawTransaction
      );
      const swapPromise = web3.eth.sendSignedTransaction(
        swapSigned.rawTransaction
      );

      const rst = await Promise.all([claimRewardPromise, swapPromise]).catch(
        (err) => {
          console.log(err);
        }
      );
      console.log(rst);

      console.log("after:  ", await erc20.methods.balanceOf(myAddr).call());

      break;
    } else {
      console.log("not bingon");
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

main();
