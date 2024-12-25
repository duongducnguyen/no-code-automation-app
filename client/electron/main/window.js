const { BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
  // Tạo cửa sổ mới
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false,
    // autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'incognito',
      // devTools: process.env.NODE_ENV === 'development'
    },
  });

  // Maximize window
  mainWindow.maximize();

  mainWindow.loadURL('http://localhost:9999');
  mainWindow.webContents.openDevTools();

  // Xử lý khi window đóng
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Xử lý lỗi load page
  mainWindow.webContents.on('did-fail-load', () => {
    console.error('Failed to load application');
    // Có thể thêm logic retry hoặc hiển thị error page
  });

  return mainWindow;
}

// Lấy instance của mainWindow
function getMainWindow() {
  return mainWindow;
}

// Đóng window
function closeMainWindow() {
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
  }
}

module.exports = {
  createWindow,
  getMainWindow,
  closeMainWindow
};