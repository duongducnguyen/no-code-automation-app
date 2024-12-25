const { ipcMain } = require('electron');
const FlowExecutor = require('../../services/flow/executor');
const SeleniumDriver = require('../../services/selenium/driver');

function setupIpcHandlers() 
{
  ipcMain.handle('start-selenium', async (_, flowData) => {
    try 
    {

      const _flowData = JSON.parse(flowData);
      const executor = new FlowExecutor(_flowData);
      return await executor.execute();   

    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('stop-selenium', async () => {
    try 
    {

      await SeleniumDriver.quit();
      return { success: true };

    } catch (error) {
      return { success: false, error: error.message };
    }
    
  });
}

module.exports = { setupIpcHandlers };