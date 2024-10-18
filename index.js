const Telegram = require("node-telegram-bot-api");
const { ethers } = require("ethers");

require("dotenv").config();

const { Account } = require("./lib/account");

const main = () => {
  const telegramBot = new Telegram(process.env.TELEGRAM_BOT, { polling: true });
  let accounts = [];

  //   telegramBot.on("message", (msg) => {
  //     console.log(msg.text);
  //   });

  telegramBot.onText(/\/(\w+)(?:\s(\w+))?/, async (msg, match) => {
    const userId = msg.from.id;
    const command = match[1];

    if (command === "add" && match[2]) {
      const account = new Account(match[2]);
      accounts.push(account);
    } else if (command === "balance" && match[2]) {
      if (ethers.utils.isAddress(match[2])) {
        const account = new Account(match[2]);
        const balance = await account.getBalance();
        telegramBot.sendMessage(msg.chat.id, balance);
      } else {
        telegramBot.sendMessage(msg.chat.id, "Please input correct Address");
      }
    } else if (command === "list" && match[2]) {
      let text = "";
      for (let account of accounts) {
        text += `Address: ${account.address}` + "\n";
        text += `Balance: ${account.balance}` + "\n";
        text += "\n";
      }
      telegramBot.sendMessage(msg.chat.id, text, {
        parse_mode: "Markdown",
      });
    }
  });

  setInterval(async () => {
    for (let account of accounts) {
      const newBalance = await account.getBalance();
      if (Number(newBalance) > account.balance) {
        account.setBalance(newBalance);
        telegramBot.sendMessage(process.env.CHAT_ID, newBalance);
      }
    }
  }, 1000);
};

main();
