const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { openChat } = require("./src/openChat.js");
const { typeMessage } = require("./src/message.js");
const config = require("./config.js");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join("renderer", "index.html"));
}

app.whenReady().then(createWindow);

function normalizeNumber(num) {
  const cleaned = num.replace(/\D/g, "");
  return cleaned.startsWith("91") ? cleaned : "91" + cleaned;
}

function loadCSV(filePath) {
  return new Promise((resolve) => {
    const out = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.WHATSAPP && row.MESSAGE) {
          out.push({ number: normalizeNumber(row.WHATSAPP), message: row.MESSAGE });
        }
      })
      .on("end", () => resolve(out));
  });
}
const { dialog } = require("electron");

ipcMain.handle("select-file", async () => {
  const res = await dialog.showOpenDialog({
    title: "Select CSV",
    properties: ["openFile"],
    filters: [{ name: "CSV", extensions: ["csv"] }]
  });

  if (res.canceled) return null;
  return res.filePaths[0];
});


function randomDelay() {
  return Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1) + config.minDelay);
}

ipcMain.handle("send-messages", async (event, filePath) => {
  const list = await loadCSV(filePath);
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().addArguments("--start-maximized"))
    .build();

  await driver.get("https://web.whatsapp.com/");
  mainWindow.webContents.send("log", "Scan QR code if needed...");
  await driver.sleep(config.waitAfterLogin);

  for (const item of list) {
    const ok = await openChat(driver, item.number);
    if (ok) {
      await typeMessage(driver, item.message);
      mainWindow.webContents.send("log", `Message sent to ${item.number}`);
      await driver.sleep(config.waitAfterTyping);
    }
    await driver.sleep(randomDelay());
  }

  await driver.quit();
  mainWindow.webContents.send("log", "All messages sent!");
});
