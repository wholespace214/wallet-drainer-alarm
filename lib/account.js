const { ethers } = require("ethers");

const ABI = ["function balanceOf(address owner) view returns (uint256)"];

const provider = new ethers.providers.JsonRpcBatchProvider(process.env.RPC_URL);

const token = new ethers.Contract(process.env.TOKEN_ADDRESS, ABI, provider);

class Account {
  constructor(address) {
    this.address = address;
    this.balance = 0;
  }

  async getBalance() {
    try {
      const balance = await token.balanceOf(this.address);
      return ethers.utils.formatUnits(balance, 18);
    } catch (e) {
      return "Error";
    }
  }

  setBalance(balance) {
    this.balance = balance;
  }
}

module.exports = {
  Account,
};
