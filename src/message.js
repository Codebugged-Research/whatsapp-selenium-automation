const { By, Key, until } = require("selenium-webdriver");
const { selectors } = require("./selectors.js");

async function typeMessage(driver, text) {
  let box = null;

  for (const sel of selectors.messageBox) {
    try {
      box = await driver.wait(until.elementLocated(By.css(sel)), 8000);
      await driver.wait(until.elementIsVisible(box), 3000);
      break;
    } catch {}
  }

  if (!box) return false;

  await box.sendKeys(text);
  await box.sendKeys(Key.ENTER);

  return true;
}

module.exports = { typeMessage };
