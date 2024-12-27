const { By, until } = require('selenium-webdriver');

async function handleNewTab(driver, data) {
  try 
  {
    // Mở tab mới
    await driver.executeScript('window.open()');
    
    // Lấy danh sách các handles
    const handles = await driver.getAllWindowHandles();
    
    // Chuyển đến tab mới (tab cuối cùng)
    const newTabHandle = handles[handles.length - 1];
    await driver.switchTo().window(newTabHandle);

    if (data.url) {
      // Navigate đến URL được chỉ định
      await driver.get(data.url);

      // Xử lý các loại wait for navigation
      const timeout = 30000; // 30 seconds timeout
      
      switch (data.waitForNavigation) {
        case 'load':
          await driver.wait(async () => {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
          }, timeout, 'Timeout waiting for page load');
          break;

        case 'domcontentloaded':
          await driver.wait(async () => {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'interactive' || readyState === 'complete';
          }, timeout, 'Timeout waiting for DOMContentLoaded');
          break;

        case 'networkidle0':
          // Đợi cho network activity hoàn toàn dừng lại
          await driver.sleep(1000); // Đợi 1s để đảm bảo network requests đã được khởi tạo
          await driver.wait(async () => {
            const activeConnections = await driver.executeScript(
              'return window.performance.getEntriesByType("resource").filter(r => !r.responseEnd).length'
            );
            return activeConnections === 0;
          }, timeout, 'Timeout waiting for network idle');
          break;

        case 'networkidle2':
          // Đợi cho network activity còn ít hơn 2 requests
          await driver.sleep(1000);
          await driver.wait(async () => 
            {
            const activeConnections = await driver.executeScript(
              'return window.performance.getEntriesByType("resource").filter(r => !r.responseEnd).length'
            );
            return activeConnections <= 2;
          }, timeout, 'Timeout waiting for network idle');
          break;
      }

      // Xử lý wait time nếu được chỉ định
      if (data.waitTime && parseInt(data.waitTime) > 0) {
        await driver.sleep(parseInt(data.waitTime));
      }
    }

    // Lấy thông tin về tab mới
    const pageTitle = await driver.getTitle();
    const currentUrl = await driver.getCurrentUrl();

    return {
      success: true,
      data: {
        title: pageTitle,
        url: currentUrl,
        windowHandle: newTabHandle
      }
    };

  } catch (error) {
    console.error('NewTab error:', error);
    
    // Thử chuyển về tab cuối cùng nếu có lỗi
    try {
      const handles = await driver.getAllWindowHandles();
      await driver.switchTo().window(handles[handles.length - 1]);
    } catch (switchError) {
      console.error('Error switching back to last tab:', switchError);
    }

    return {
      success: false,
      error: error.message,
      type: 'NEW_TAB_ERROR'
    };
  }
}

module.exports = handleNewTab;