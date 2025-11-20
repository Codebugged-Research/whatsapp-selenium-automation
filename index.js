const fs = require("fs");
const csv = require("csv-parser");
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("./config.js");
const { openChat } = require("./src/openChat.js");
const { typeMessage } = require("./src/message.js");

const randomDelay = () => {
  return Math.floor(
    Math.random() * (config.maxDelay - config.minDelay + 1) + config.minDelay
  );
};

const normalizeNumber = (num) => {
  const cleaned = num.replace(/\D/g, "");
  return cleaned.startsWith("91") ? cleaned : "91" + cleaned;
};

const loadCSV = (filePath) => {
  return new Promise((resolve) => {
    const out = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.WHATSAPP && row.MESSAGE) {
          out.push({
            number: normalizeNumber(row.WHATSAPP),
            message: row.MESSAGE,
          });
        }
      })
      .on("end", () => resolve(out));
  });
};

const start = async () => {
  const csvFilePath = "whsend.csv"; 
  const list = await loadCSV(csvFilePath);

  const options = new chrome.Options();
  options.addArguments("--start-maximized");
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  await driver.get("https://web.whatsapp.com/");
  console.log("Scan QR code if not logged in...");
  await driver.sleep(config.waitAfterLogin);

  for (const item of list) {
    const ok = await openChat(driver, item.number);
    if (ok) {
      await typeMessage(driver, item.message);
      await driver.sleep(config.waitAfterTyping);
    }
    await driver.sleep(randomDelay());
  }

  await driver.quit();
  console.log("All messages processed.");
};

start();
