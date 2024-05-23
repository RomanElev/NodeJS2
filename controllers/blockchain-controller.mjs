import { response } from "express";
import { blockchain } from "../startup.mjs";

const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, data: blockchain });
};

// endpoint .../mine.
const createBlock = (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = req.body;
  const timestamp = Date.now();

  const currentBlockHash = blockchain.hashBlock(
    timestamp,
    lastBlock.currentBlockHash,
    data
  );

  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currentBlockHash,
    currentBlockHash,
    data
  );

  res.status(201).json({ success: true, data: block });
};

//Consensus endpoint (synkroniseringen)...
const synchronizeChain = (req, res, next) => {
  //Ta redo på aktuellt block i kejan...
  const currentLength = blockchain.chain.length;
  let maxLength = currentLength;
  let longestChain = null;

  //Gå igenom alla noder...
  blockchain.memberNodes.forEach(async (member) => {
    const response = await fetch(`${member}/api/v1/blockchain`);
    if (response.ok) {
      const result = await response.json();

      if (result.data.chain.length > maxLength) {
        maxLength = result.data.chain.length;
        longestChain = result.data.chain;
      }

      if (
        !longestChain ||
        (longestChain && !blockchain.validateChain(longestChain))
      ) {
        console.log("Är synkad");
      } else {
        blockchain.chain = longestChain;
        console.log(blockchain);
      }
    }
  });
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { message: "Synkroniseringen är klar" },
  });
};

export { createBlock, getBlockchain, synchronizeChain };
