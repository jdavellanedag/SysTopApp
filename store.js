const electron = require("electron");
const path = require("path");
const fs = require("fs");

class Store {
  constructor(options) {
    const userDataPath = (electron.app || electron.remote).getPath("userData");
    this.path = path.join(userDataPath, options.configName + ".json");
    this.data = parseDateFile(this.path, options.defaults);
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

const parseDateFile = (filePath, defaults) => {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
};

module.exports = Store;
