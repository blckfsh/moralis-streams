const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
require("dotenv").config();
const { MORALIS_API_KEY, WEBHOOK_URL } = process.env;

// Specific NFTs
const baycTransferAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
]; // valid abi of the event

const options = {
  chains: [EvmChain.ETHEREUM], // list of blockchains to monitor
  description: "7444 - 7932 bayc", // your description
  tag: "bayc", // give it a tag
  abi: baycTransferAbi,
  includeContractLogs: true,
  topic0: ["Transfer(address,address,uint256)"], // topic of the event
  advancedOptions: [
    {
      topic0: "Transfer(address,address,uint256)",
      filter: { in: ["tokenId", ["7444", "7932"]] }, // only receive transfer events with token ids present
      includeNativeTxs: true,
    },
  ],
  webhookUrl: `${WEBHOOK_URL}/nfts/specific`, // webhook url to receive events,
};

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(async () => {
  const stream = await Moralis.Streams.add(options);
  const { id } = stream.toJSON(); // { id: 'YOUR_STREAM_ID', ...stream }

  // Attach the contract address to the stream
  await Moralis.Streams.addAddress({
    id,
    address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", // bayc address
  });
});
