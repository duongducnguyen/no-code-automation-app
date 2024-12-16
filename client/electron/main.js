const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false, // Mở toàn màn hình
    autoHideMenuBar: true, // Ẩn thanh menu
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: false
    },
  });

  mainWindow.maximize();

  // Load React app
  mainWindow.loadURL('http://localhost:9999');

  // Open DevTools (tùy chọn)
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => 
  {
    mainWindow = null;
  });
  
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});