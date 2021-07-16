const Web3 = require('web3');
const abiDecoder = require('abi-decoder')

let web3 = new Web3("https://rpc-mainnet.matic.network");

const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "director",
                "type": "address"
            }
        ],
        "name": "earned",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const swapAbi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const boardroomAddr = "0x376d053876fdb5601cb87a342ee200e86704da62"
const swapAddr = "0x376d053876fdb5601cb87a342ee200e86704da62"
const myAddr = "0xd8aBbc1AAC264f84d3aae1e6E501fe8EC3EB99d1"
const yourPrivateKey = '';

async function main() {
    const contract = new web3.eth.Contract(abi, boardroomAddr)
    const swapContract = new web3.eth.Contract(swapAbi, swapAddr)
    const reward = await contract.methods.earned(myAddr).call()
    while (true) {
        if (reward != 0) {
            console.log(reward)

            const claimRewardSigned = await web3.eth.accounts.signTransaction({
                to: boardroomAddr,
                data: "0xb88a802f",
                gas: '20000000',
                gasPrice: "100000000000",
            }, yourPrivateKey);


            const swapTx = await swapContract.methods.swapExactTokensForTokens(reward, 0, ["3ae112f0ff3893c8e8675de170fd72406e9580f2", '2791bca1f2de4661ed88a30c99a7a9449aa84174'], myAddr, 325288953600)


            const swapSigned = await web3.eth.accounts.signTransaction({
                to: swapAddr,
                data: swapTx.encodeABI(),
                gas: '20000000',
                gasPrice: "50000000000",
            }, yourPrivateKey);

            const claimRewardPromise = web3.eth.sendSignedTransaction(claimRewardSigned.rawTransaction)
            const swapPromise = web3.eth.sendSignedTransaction(swapSigned.rawTransaction)

            const rst = await Promise.all([claimRewardPromise,swapPromise])
            console.log(rst)
            break

        }else{
            console.log("not bingon")
        }
        await new Promise(r => setTimeout(r, 500));
    }

}

main()