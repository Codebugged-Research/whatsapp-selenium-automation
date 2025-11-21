const { app, BrowserWindow, ipcMain, dialog } = require("electron");
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
  let driver;
  try {
    mainWindow.webContents.send("log", "Loading CSV...");
    const list = await loadCSV(filePath);
    mainWindow.webContents.send("log", `Found ${list.length} contacts`);
    
    mainWindow.webContents.send("log", "Setting up Chrome...");
    
    const seleniumManagerPath = path.join(
      app.isPackaged 
        ? path.join(process.resourcesPath, "app.asar.unpacked", "node_modules", "selenium-webdriver")
        : path.join(__dirname, "node_modules", "selenium-webdriver"),
      "bin",
      process.platform === "darwin" ? "macos" : (process.platform === "win32" ? "windows" : "linux"),
      "selenium-manager"
    );
    
    if (fs.existsSync(seleniumManagerPath)) {
      mainWindow.webContents.send("log", "Found Selenium Manager");
      if (process.platform !== "win32") {
        const { execSync } = require("child_process");
        try {
          execSync(`chmod +x "${seleniumManagerPath}"`);
          mainWindow.webContents.send("log", "Made Selenium Manager executable");
        } catch (e) {
          mainWindow.webContents.send("log", `Chmod warning: ${e.message}`);
        }
      }
      process.env.SE_MANAGER_PATH = seleniumManagerPath;
    }
    
    const options = new chrome.Options();
    options.addArguments("--start-maximized");
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");
    
    mainWindow.webContents.send("log", "Starting Chrome browser...");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
      
    mainWindow.webContents.send("log", "Chrome started successfully");
    await driver.get("https://web.whatsapp.com/");
    mainWindow.webContents.send("log", "Scan QR code if needed...");
    await driver.sleep(config.waitAfterLogin);
    
    for (const item of list) {
      const ok = await openChat(driver, item.number);
      if (ok) {
        await typeMessage(driver, item.message);
        mainWindow.webContents.send("log", `Message sent to ${item.number}`);
        await driver.sleep(config.waitAfterTyping);
      } else {
        mainWindow.webContents.send("log", `Failed to open chat for ${item.number}`);
      }
      await driver.sleep(randomDelay());
    }
    
    await driver.quit();
    mainWindow.webContents.send("log", "All messages sent!");
  } catch (error) {
    mainWindow.webContents.send("log", `ERROR: ${error.message}`);
    console.error("Full error:", error);
    if (driver) {
      try {
        await driver.quit();
      } catch (quitError) {
        console.error("Error quitting driver:", quitError);
      }
    }
  }
});