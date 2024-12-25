const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Modified to accept parameters
  startSelenium: (flowScriptData) => ipcRenderer.invoke('start-selenium', flowScriptData),
  stopSelenium: () => ipcRenderer.invoke('stop-selenium')
});