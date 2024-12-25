// nodeHandlers.js
const handleOpenURL = require('./navigation/openURL');
const handleRefreshPage = require('./navigation/refreshPage');
const handleStart = require('./other/start');
const handleStop = require('./other/stop');

// Export dưới dạng object với key là type của node
module.exports = {
  'openURL': handleOpenURL,
  'refreshPage': handleRefreshPage,
  'start': handleStart,
  'stop': handleStop
};