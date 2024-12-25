// handlers/navigation/openURL.js
const { By, until } = require('selenium-webdriver');

// Export trực tiếp function thay vì object
async function handleOpenURL(driver, data) {
  try {
    if (!data.url) {
      throw new Error('URL is required');
    }

    console.log(`Navigating to: ${data.url}`);
    await driver.get(data.url);
    await driver.wait(until.elementLocated(By.tagName('body')), 10000);
    
    return { 
      success: true,
      data: {
        url: data.url,
        title: await driver.getTitle()
      }
    };
  } catch (error) {
    console.error('OpenURL error:', error);
    return { 
      success: false, 
      error: error.message,
      type: 'URL_ERROR'
    };
  }
}

module.exports = handleOpenURL;