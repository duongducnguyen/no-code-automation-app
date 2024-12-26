// handlers/actions/handleTypeText.js
const { By, until, Key } = require('selenium-webdriver');

async function handleTypeText(driver, data) {
  try {
    // Validate required data
    if (!data.text) {
      throw new Error('Text is required');
    }

    let element;
    
    // If selector is provided, find and focus on element
    if (data.selector) {
      let locator;
      switch (data.selectorType) {
        case 'xpath':
          locator = By.xpath(data.selector);
          break;
        case 'css':
          locator = By.css(data.selector);
          break;
        case 'text':
          locator = By.xpath(`//*[contains(text(), '${data.selector}')]`);
          break;
        default:
          throw new Error('Invalid selector type');
      }

      const timeout = (data.timeout || 10) * 1000;
      element = await driver.wait(
        until.elementLocated(locator),
        timeout,
        `Element not found within ${timeout}ms`
      );

      await driver.wait(
        until.elementIsVisible(element),
        timeout,
        'Element is not visible'
      );
    }

    if (data.typeAsHuman) {
      // Calculate delay based on speed (1-5)
      const baseDelay = 200; // Base delay in ms
      const speedFactor = 6 - (data.speed || 3); // Invert speed scale
      const delay = baseDelay * speedFactor;

      // Type text character by character with random delays
      for (const char of data.text) {
        if (element) {
          await element.sendKeys(char);
        } else {
          await driver.actions().sendKeys(char).perform();
        }
        
        // Random delay variation ±20%
        const randomDelay = delay * (0.8 + Math.random() * 0.4);
        await new Promise(resolve => setTimeout(resolve, randomDelay));
      }
    } else {
      // Type text instantly
      if (element) {
        await element.sendKeys(data.text);
      } else {
        await driver.actions().sendKeys(data.text).perform();
      }
    }

    return {
      success: true,
      data: {
        textEntered: data.text,
        selector: data.selector,
        selectorType: data.selectorType
      }
    };

  } catch (error) {
    console.error('Type text error:', error);
    return {
      success: false,
      error: error.message,
      type: 'TYPE_TEXT_ERROR',
      details: {
        text: data.text,
        selector: data.selector,
        selectorType: data.selectorType
      }
    };
  }
}

module.exports = handleTypeText;