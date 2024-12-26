// handlers/conditions/handleElementExists.js
const { By, until } = require('selenium-webdriver');

async function handleElementExists(driver, data) {
  try {
    // Validate required data
    if (!data.selector) {
      throw new Error('Selector is required');
    }

    // Setup locator based on selector type
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
    let elementExists = false;

    try {
      if (data.waitForVisible) {
        // Wait for element to be both present and visible
        const element = await driver.wait(
          until.elementLocated(locator),
          timeout
        );
        await driver.wait(
          until.elementIsVisible(element),
          timeout
        );
        elementExists = true;
      } else {
        // Just check if element is present in DOM
        await driver.wait(
          until.elementLocated(locator),
          timeout
        );
        elementExists = true;
      }
    } catch (error) {
      // Element not found or not visible within timeout
      elementExists = false;
    }

    // Handle inverse check
    const condition = data.inverse ? !elementExists : elementExists;

    return {
      success: condition,
      data: {
        elementExists: elementExists,
        selector: data.selector,
        selectorType: data.selectorType,
        inverse: data.inverse,
        waitedForVisible: data.waitForVisible
      }
    };

  } catch (error) {
    console.error('Element exists check error:', error);
    return {
      success: false,
      error: error.message,
      type: 'ELEMENT_EXISTS_ERROR',
      details: {
        selector: data.selector,
        selectorType: data.selectorType,
        inverse: data.inverse,
        waitForVisible: data.waitForVisible
      }
    };
  }
}

module.exports = handleElementExists;