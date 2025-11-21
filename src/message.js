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
  
  await box.click();
  
  for (let char of text) {
    await box.sendKeys(char);
    await driver.sleep(Math.random() * 100 + 50);
  }
  
  await driver.sleep(500);
  await box.sendKeys(Key.ENTER);
  return true;
}

module.exports = { typeMessage };