async function handleGoBack(driver, data) {
  try {
    await driver.navigate().back();
    
    return {
      success: true,
      data: {
        currentUrl: await driver.getCurrentUrl()
      }
    };
  } catch (error) {
    console.error('GoBack error:', error);
    return {
      success: false,
      error: error.message,
      type: 'GO_BACK_ERROR'
    };
  }
}

module.exports = handleGoBack;