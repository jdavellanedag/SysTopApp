const path = require("path");
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Store = require("./store");
const MainWindow = require("./mainWindow");
const AppTray = require("./appTray");

// Set env development/production
process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let tray;
// Init store & defaults
const store = new Store({
  configName: "user-setting",
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5,
    },
  },
});

function createMainWindow() {
  mainWindow = new MainWindow("./app/index.html", isDev);
}

app.on("ready", () => {
  createMainWindow();

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.webContents.send("settings:get", store.get("settings"));
  });

  mainWindow.on("close", (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
    return true;
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  const icon = path.join(__dirname, "assets", "icons", "tray_icon.png");

  // Create tray
  tray = new AppTray(icon, mainWindow);
});

const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    role: "fileMenu",
  },
  {
    label: "View",
    submenu: [
      {
        label: "Toggle navigation",
        click: () => mainWindow.webContents.send("nav:toggle"),
      },
    ],
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

// Set settings
ipcMain.on("settings:set", (e, value) => {
  store.set("settings", value);
  mainWindow.webContents.send("settings:get", store.get("settings"));
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.allowRendererProcessReuse = true;
