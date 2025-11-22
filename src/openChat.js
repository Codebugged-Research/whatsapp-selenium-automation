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
  console.log(`Typed number: ${number}`);
  
  await driver.sleep(10000);
  console.log("Waited 10 seconds for contact to load");
  
  await box.sendKeys(Key.ENTER);
  console.log("Pressed ENTER to open chat");
  
  await driver.sleep(3000);
  
  let messageBoxFound = false;
  for (const sel of selectors.messageBox) {
    try {
      const msgBox = await driver.wait(until.elementLocated(By.css(sel)), 8000);
      await driver.wait(until.elementIsVisible(msgBox), 3000);
      console.log("Message box loaded - chat opened successfully");
      messageBoxFound = true;
      break;
    } catch {}
  }
  
  if (!messageBoxFound) {
    console.log("Message box not found after opening chat");
    return false;
  }
  
  return true;
}

module.exports = { openChat };