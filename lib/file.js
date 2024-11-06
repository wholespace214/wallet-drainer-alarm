const fs = require("fs");
const path = require("path");

const saveAddressList = async (list) => {
  let cacheFile = path.join(__dirname, "..", ".list");
  let data = list.join(",");
  fs.writeFileSync(cacheFile, data, { encoding: "utf-8" });
};

const loadAddressList = async () => {
  let cacheFile = path.join(__dirname, "..", ".list");
  let list = [];
  if (fs.existsSync(cacheFile)) {
    const content = fs.readFileSync(cacheFile, "utf-8");
    list = content.split(",").map((item) => item.trim());
  }
  return list;
};

module.exports = {
  saveAddressList,
  loadAddressList,
};
