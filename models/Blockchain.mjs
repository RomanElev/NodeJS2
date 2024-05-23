import { createHash } from "../utilities/crypto-lib.mjs";
import Block from "./Block.mjs";

export default class Blockchain {
  constructor() {
    this.chain = [];
    //Array för veta vilka medlemmar(noder) finns i min blockkedja...
    this.memberNodes = [];
    //Variabel för vår egen node url(namn)...
    this.nodeUrl = process.argv[3];

    // Skapa vårt genisis block...
    this.createBlock(Date.now(), "0", "0", []);
  }

  // Metod för att lägga till ett nytt block i kedjan...
  createBlock(timestamp, previousBlockHash, currentBlockHash, data) {
    // Skapa blocket...
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      previousBlockHash,
      currentBlockHash,
      data
    );

    this.chain.push(block);

    return block;
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  hashBlock(timestamp, previousBlockHash, currentBlockData) {
    const stringToHash =
      timestamp.toString() +
      previousBlockHash +
      JSON.stringify(currentBlockData);
    const hash = createHash(stringToHash);

    return hash;
  }

  validateChain(blockchain) {
    let isValid = true;
    //Validerar varje block...
    for (let i = 1; i < blockchain.length; i++) {
      const block = blockchain[i];
      const previousBlock = blockchain[i - 1];

      const hash = this.hashBlock(
        block.timestamp,
        previousBlock.currentBlockHash,
        block.data
      );

      if (hash !== block.currentBlockHash) isValid = false;
      if (block.previousBlockHash !== previousBlock.currentBlockHash)
        isValid = false;
    }

    return isValid;
  }
}
