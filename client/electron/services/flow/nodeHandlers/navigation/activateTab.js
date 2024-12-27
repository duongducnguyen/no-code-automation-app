async function handleActivateTab(driver, data) {
  try {
    // Lấy tất cả handles của các tab đang mở
    const handles = await driver.getAllWindowHandles();
    
    // Kiểm tra nếu không có tab nào
    if (handles.length === 0) {
      throw new Error('No tabs available');
    }

    let targetHandle = null;

    if (data.selectType === 'index') {
      // Chuyển đổi string sang number và kiểm tra tính hợp lệ
      const index = parseInt(data.tabValue);
      if (isNaN(index) || index < 0 || index >= handles.length) {
        throw new Error(`Invalid tab index: ${data.tabValue}. Available tabs: ${handles.length}`);
      }
      targetHandle = handles[index];
    } else if (data.selectType === 'contains') {
      // Lưu handle hiện tại để có thể quay lại nếu không tìm thấy
      const currentHandle = await driver.getWindowHandle();
      
      // Tìm tab có URL chứa chuỗi được chỉ định
      for (const handle of handles) {
        await driver.switchTo().window(handle);
        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes(data.tabValue)) {
          targetHandle = handle;
          break;
        }
      }

      // Nếu không tìm thấy tab phù hợp, quay lại tab ban đầu và báo lỗi
      if (!targetHandle) {
        await driver.switchTo().window(currentHandle);
        throw new Error(`No tab found with URL containing: ${data.tabValue}`);
      }
    } else {
      throw new Error('Invalid selection type');
    }

    // Chuyển đến tab đích
    await driver.switchTo().window(targetHandle);

    // Lấy thông tin về tab hiện tại
    const pageTitle = await driver.getTitle();
    const currentUrl = await driver.getCurrentUrl();

    return {
      success: true,
      data: {
        title: pageTitle,
        url: currentUrl,
        windowHandle: targetHandle,
        index: handles.indexOf(targetHandle)
      }
    };

  } catch (error) {
    console.error('ActivateTab error:', error);
    
    // Thử lấy danh sách handles hiện tại
    let currentHandles = [];
    try {
      currentHandles = await driver.getAllWindowHandles();
    } catch (e) {
      console.error('Error getting window handles:', e);
    }

    return {
      success: false,
      error: error.message,
      type: 'ACTIVATE_TAB_ERROR',
      data: {
        availableTabs: currentHandles.length
      }
    };
  }
}

// Thêm một số utility functions hữu ích
async function getCurrentTabInfo(driver) {
  try {
    const handle = await driver.getWindowHandle();
    const handles = await driver.getAllWindowHandles();
    const title = await driver.getTitle();
    const url = await driver.getCurrentUrl();

    return {
      handle,
      index: handles.indexOf(handle),
      title,
      url
    };
  } catch (error) {
    console.error('Error getting current tab info:', error);
    return null;
  }
}

async function listAllTabs(driver) {
  const tabs = [];
  try {
    const currentHandle = await driver.getWindowHandle();
    const handles = await driver.getAllWindowHandles();

    for (const handle of handles) {
      await driver.switchTo().window(handle);
      tabs.push({
        handle,
        index: handles.indexOf(handle),
        title: await driver.getTitle(),
        url: await driver.getCurrentUrl()
      });
    }

    // Quay lại tab ban đầu
    await driver.switchTo().window(currentHandle);

    return tabs;
  } catch (error) {
    console.error('Error listing tabs:', error);
    return tabs;
  }
}

module.exports = {
  handleActivateTab,
  getCurrentTabInfo,
  listAllTabs
};