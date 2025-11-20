const { By, Key, until } = require("selenium-webdriver");
const { selectors } = require("./selectors.js");

async function openChat(driver, number) {
  let box = null;

  for (const sel of selectors.searchBox) {
    try {
      box = await driver.wait(until.elementLocated(By.css(sel)), 8000);
      await driver.wait(until.elementIsVisible(box), 3000);
      break;
    } catch {}
  }

  if (!box) return false;

  await box.click();
  await box.sendKeys(Key.CONTROL, "a");
  await box.sendKeys(number);
  await driver.sleep(1500);
  await box.sendKeys(Key.ENTER);
  await driver.sleep(3000);

  return true;
}

module.exports = { openChat };
