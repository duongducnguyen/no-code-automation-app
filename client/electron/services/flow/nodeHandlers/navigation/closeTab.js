async function handleCloseTab(driver, data) {
  try {
    const handles = await driver.getAllWindowHandles();
    
    if (handles.length <= 1) {
      throw new Error('Cannot close the last tab');
    }

    let tabToClose;
    if (data.closeType === 'current') {
      tabToClose = await driver.getWindowHandle();
    } else if (data.closeType === 'specific') {
      const index = parseInt(data.tabValue);
      if (isNaN(index) || index < 0 || index >= handles.length) {
        throw new Error(`Invalid tab index: ${data.tabValue}`);
      }
      tabToClose = handles[index];
    }

    // Switch to another tab before closing
    const otherHandle = handles.find(handle => handle !== tabToClose);
    await driver.switchTo().window(otherHandle);
    
    // Close the specified tab
    await driver.switchTo().window(tabToClose);
    await driver.close();
    
    // Switch back to the other tab
    await driver.switchTo().window(otherHandle);

    return {
      success: true,
      data: {
        closedTab: tabToClose,
        remainingTabs: handles.length - 1
      }
    };
  } catch (error) {
    console.error('CloseTab error:', error);
    return {
      success: false,
      error: error.message,
      type: 'CLOSE_TAB_ERROR'
    };
  }
}

module.exports = handleCloseTab;

