const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
require("dotenv").config();
const { MORALIS_API_KEY, WEBHOOK_URL } = process.env;

// For All NFT transfers
// const transferAbi = [
//     {
//         "anonymous": false,
//         "inputs": [
//           {
//             "indexed": true,
//             "internalType": "address",
//             "name": "from",
//             "type": "address"
//           },
//           {
//             "indexed": true,
//             "internalType": "address",
//             "name": "to",
//             "type": "address"
//           },
//           {
//             "indexed": true,
//             "internalType": "uint256",
//             "name": "tokenId",
//             "type": "uint256"
//           }
//         ],
//         "name": "Transfer",
//         "type": "event"
//       }
// ]

// const options = {
//     chains: [EvmChain.GOERLI],
//     description: "All ETH NFT Trasfers",
//     tag: "nft",
//     allAddresses: true,
//     includeContractLogs: true,
//     abi: transferAbi,
//     topic0: ["Transfer(address,address,uint256)"],
//     webhookUrl: `${WEBHOOK_URL}/webhook`
// }

// Specific NFTs

const punkTransferAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "punkIndex", type: "uint256" },
    ],
    name: "PunkTransfer",
    type: "event",
  },
]; // valid abi of the event

const options = {
  chains: [EvmChain.ETHEREUM], // list of blockchains to monitor
  description: "1000 to 1002 cryptopunks", // your description
  tag: "cryptoPunks", // give it a tag
  abi: punkTransferAbi,
  includeContractLogs: true,
  topic0: ["PunkTransfer(address,address,uint256)"], // topic of the event
  // advancedOptions: [
  //   {
  //     topic0: "PunkTransfer(address,address,uint256)",
  //     filter: { in: ["punkIndex", ["1000", "1001", "1002"]] }, // only receive transfer events if the token id is 1000/1001/1002
  //     includeNativeTxs: true,
  //   },
  // ],
  webhookUrl: `${WEBHOOK_URL}/webhook`, // webhook url to receive events,
};

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(async () => {
  // For All NFT transfers
  // const stream = await Moralis.Streams.add(options);
  // console.log(stream);
  const stream = await Moralis.Streams.add(options);

  const { id } = stream.toJSON(); // { id: 'YOUR_STREAM_ID', ...stream }

  // Attach the contract address to the stream
  await Moralis.Streams.addAddress({
    id,
    address: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB", // crypto punks address
  });
});
