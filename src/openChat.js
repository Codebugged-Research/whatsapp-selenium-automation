const { By, Key, until } = require("selenium-webdriver");
const { selectors } = require("./selectors.js");

async function openChat(driver, number) {
  try {
    console.log(`Attempting to open chat for: ${number}`);
    
    await driver.sleep(2000);
    
    const newChatSelectors = [
      'button[aria-label="New chat"]',
      'button[title="New chat"]',
      'button[data-tab="2"]',
      'div[aria-label="New chat"]',
      'span[data-icon="new-chat-outline"]'
    ];
    
    let newChatButton = null;
    for (const sel of newChatSelectors) {
      try {
        if (sel.includes('span[data-icon')) {
          newChatButton = await driver.wait(
            until.elementLocated(By.css(sel)),
            5000
          );
          newChatButton = await newChatButton.findElement(By.xpath('ancestor::button'));
        } else {
          newChatButton = await driver.wait(
            until.elementLocated(By.css(sel)),
            5000
          );
        }
        await driver.wait(until.elementIsVisible(newChatButton), 3000);
        console.log(`Found new chat button with selector: ${sel}`);
        break;
      } catch (e) {
        console.log(`Failed with selector ${sel}: ${e.message}`);
      }
    }
    
    if (!newChatButton) {
      console.log("New chat button not found");
      return false;
    }
    
    await newChatButton.click();
    console.log("Clicked new chat button");
    await driver.sleep(3000);
    
    let searchBox = null;
    for (const sel of selectors.newChatSearchBox) {
      try {
        searchBox = await driver.wait(until.elementLocated(By.css(sel)), 8000);
        await driver.wait(until.elementIsVisible(searchBox), 3000);
        console.log(`Found search box with selector: ${sel}`);
        break;
      } catch (e) {
        console.log(`Failed to find search box with ${sel}: ${e.message}`);
      }
    }
    
    if (!searchBox) {
      console.log("Search box not found");
      return false;
    }
    
    await searchBox.click();
    await driver.sleep(500);
    await searchBox.sendKeys(number);
    console.log(`Typed number: ${number}`);
    await driver.sleep(5000);
    
    try {
      const formattedNumber = number.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3');
      console.log(`Looking for contact with formatted number: ${formattedNumber}`);
      
      const contactSpan = await driver.wait(
        until.elementLocated(By.css(`span[title="${formattedNumber}"]`)),
        8000
      );
      
      console.log("Found contact span");
      
      const gridCell = await contactSpan.findElement(By.xpath('ancestor::div[@role="gridcell"]'));
      console.log("Found gridcell container");
      
      await driver.sleep(500);
      await gridCell.click();
      console.log("Clicked on gridcell");
      await driver.sleep(3000);
      return true;
    } catch (err) {
      console.log("Error finding/clicking contact:", err.message);
      
      try {
        console.log("Trying alternative: sending ENTER key");
        await searchBox.sendKeys(Key.ENTER);
        await driver.sleep(3000);
        return true;
      } catch (enterErr) {
        console.log("ENTER key also failed:", enterErr.message);
        return false;
      }
    }
  } catch (error) {
    console.error("Error opening chat:", error.message);
    return false;
  }
}

module.exports = { openChat };