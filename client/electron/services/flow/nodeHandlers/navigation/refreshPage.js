// handlers/navigation/refreshPage.js
const { By, until } = require('selenium-webdriver');

async function handleRefreshPage(driver, data) {
  try {
    
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.tagName('body')), 10000);

    return { 
      success: true,
      data: {
        title: await driver.getTitle(),
        url: await driver.getCurrentUrl()
      }
    };
  } catch (error) {
    console.error('RefreshPage error:', error);
    return { 
      success: false, 
      error: error.message,
      type: 'REFRESH_ERROR'
    };
  }
}

module.exports = handleRefreshPage;