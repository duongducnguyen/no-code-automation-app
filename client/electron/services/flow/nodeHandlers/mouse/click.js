const { By, until, Button } = require('selenium-webdriver');

async function handleClick(driver, data) {
  try {
    // Validate required data
    if (!data.selector) {
      throw new Error('Selector is required');
    }

    // Map button types
    const buttonMap = {
      'left': Button.LEFT,
      'right': Button.RIGHT,
      'center': Button.MIDDLE
    };

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
        // For text search, we'll use XPath contains
        locator = By.xpath(`//*[contains(text(), '${data.selector}')]`);
        break;
      default:
        throw new Error('Invalid selector type');
    }

    // Wait for element with timeout
    const timeout = (data.timeout || 10) * 1000; // Convert to milliseconds
    const element = await driver.wait(
      until.elementLocated(locator),
      timeout,
      `Element not found within ${timeout}ms`
    );

    // Wait for element to be clickable
    await driver.wait(
      until.elementIsVisible(element),
      timeout,
      'Element is not visible'
    );

    // Perform clicks based on clickCount
    const clickCount = data.clickCount || 1;
    const actions = driver.actions({bridge: true});

    for (let i = 0; i < clickCount; i++) {
      if (i > 0) {
        // Add small delay between multiple clicks
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await actions
        .move({origin: element})
        .click(buttonMap[data.button] || Button.LEFT)
        .perform();
    }

    return {
      success: true,
      data: {
        elementClicked: true,
        clickCount: clickCount,
        selector: data.selector,
        selectorType: data.selectorType
      }
    };

  } catch (error) {
    console.error('Click error:', error);
    return {
      success: false,
      error: error.message,
      type: 'CLICK_ERROR',
      details: {
        selector: data.selector,
        selectorType: data.selectorType,
        button: data.button,
        clickCount: data.clickCount
      }
    };
  }
}

module.exports = handleClick;