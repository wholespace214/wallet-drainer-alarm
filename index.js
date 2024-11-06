const Telegram = require("node-telegram-bot-api");
const { ethers } = require("ethers");

require("dotenv").config();

const { Account } = require("./lib/account");
const { loadAddressList, saveAddressList } = require("./lib/file");

const main = async () => {
  const telegramBot = new Telegram(process.env.TELEGRAM_BOT, { polling: true });
  let accounts = [];

  const list = await loadAddressList();

  for (let item of list) {
    const account = new Account(item);
    accounts.push(account);
  }

  telegramBot.onText(/\/(\w+)(?:\s(\w+))?/, async (msg, match) => {
    const userId = msg.from.id;
    const command = match[1];

    if (command === "add" && match[2]) {
      list.push(match[2]);
      const account = new Account(match[2]);
      accounts.push(account);
      saveAddressList(list);
    } else if (command === "balance" && match[2]) {
      if (ethers.utils.isAddress(match[2])) {
        const account = new Account(match[2]);
        const balance = await account.getBalance();
        account.setBalance(balance);
        telegramBot.sendMessage(msg.chat.id, balance);
      } else {
        telegramBot.sendMessage(msg.chat.id, "Please input correct Address");
      }
    } else if (command === "list") {
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
      if (Number(newBalance) !== Number(account.balance)) {
        account.setBalance(newBalance);
        let text = "";
        text += `Address: ${account.address}` + "\n";
        text += `Balance: ${newBalance}` + "\n";
        telegramBot.sendMessage(process.env.CHAT_ID, text, {
          parse_mode: "Markdown",
        });
      }
    }
  }, 1000);
};

main();
