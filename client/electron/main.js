const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { ServiceBuilder } = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const { By, until } = require('selenium-webdriver'); // Thêm until vào đây

let mainWindow;
let driver = null; // Biến global để quản lý driver

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false, // Mở toàn màn hình
    autoHideMenuBar: true, // Ẩn thanh menu
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'incognito',
      devTools: false
    },
  });

  mainWindow.maximize();
  mainWindow.loadURL('http://localhost:9999');
  mainWindow.webContents.openDevTools();
}

ipcMain.handle('start-selenium', async (event, flowScriptData) => {
try 
{

    // Kiểm tra và đóng driver cũ nếu còn
    if (driver) {
      await driver.quit();
      driver = null;
    }

    // Khởi tạo Chrome options
    const options = new chrome.Options()
      .addArguments('--start-maximized')
      .addArguments('--disable-infobars')
      .addArguments('--disable-extensions')
      .addArguments('--disable-dev-shm-usage')
      .addArguments('--no-sandbox');

    const service = new ServiceBuilder(chromedriver.path);

    // Khởi tạo driver
    driver = await new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    // Tạo map các nodes để dễ truy cập
    const nodesMap = new Map(flowScriptData.nodes.map(node => [node.id, node]));
    
    // Tìm node start
    let currentNode = flowScriptData.nodes.find(node => node.type === 'start');
    
    // Thực thi flow
    while (currentNode && currentNode.type !== 'stop') {
      console.log(`Processing node: ${currentNode.type}`);
      
      // Xử lý các loại node
      switch (currentNode.type) {
        case 'openURL':
          if (currentNode.data.url) {
            console.log('Navigating to:', currentNode.data.url);
            await driver.get(currentNode.data.url);
            await driver.wait(until.elementLocated(By.tagName('body')), 10000);
          }
          break;
        // Thêm các case khác nếu cần
      }
      
      // Tìm edge từ node hiện tại
      const nextEdge = flowScriptData.edges.find(edge => edge.source === currentNode.id);
      
      // Chuyển đến node tiếp theo
      currentNode = nextEdge ? nodesMap.get(nextEdge.target) : null;
    }

    return { 
      success: true, 
      message: 'Flow executed successfully'
    };

  } catch (error) {
    console.error('Selenium error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Cleanup nếu có lỗi
    if (driver) {
      try {
        await driver.quit();
      } catch (quitError) {
        console.error('Error while quitting driver:', quitError);
      }
      driver = null;
    }

    return { 
      success: false, 
      error: error.message 
    };
  }
});

ipcMain.handle('stop-selenium', async () => 
{
  
  try {
    if (driver) 
    {
      await driver.quit();
      driver = null;
      return { 
        success: true, 
        message: 'Selenium stopped successfully' 
      };
    } else {
      return { 
        success: true, 
        message: 'No active Selenium session to stop' 
      };
    }
  } catch (error) 
  {
    console.error('Error stopping Selenium:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
});

// Cleanup khi app đóng
app.on('before-quit', async () => {
  if (driver) {
    try {
      console.log('Closing driver on app quit...');
      await driver.quit();
      driver = null;
    } catch (error) {
      console.error('Error closing driver:', error);
    }
  }
});

// Clear cache và cookies trước khi khởi tạo app
app.whenReady().then(async () => {
  try {
    // Clear toàn bộ cache và cookies
    const ses = session.defaultSession;
    
    await ses.clearStorageData({
      storages: [
        'appcache',
        'cookies',
        'filesystem',
        'indexdb',
        'localstorage',
        'shadercache',
        'websql',
        'serviceworkers',
        'cachestorage'
      ],
      quotas: ['temporary', 'persistent', 'syncable']
    });
    
    await ses.clearCache();
    
    console.log('Successfully cleared all browser data');

    // Sau khi clear xong mới tạo window
    createWindow();
  } catch (error) {
    console.error('Error clearing browser data:', error);
    // Vẫn tạo window ngay cả khi có lỗi
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});