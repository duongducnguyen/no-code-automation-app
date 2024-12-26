// nodeHandlers.js
const handleOpenURL = require('./navigation/openURL');
const handleRefreshPage = require('./navigation/refreshPage');
const handleStart = require('./other/start');
const handleStop = require('./other/stop');
const handleClick = require('./mouse/click');
const handleTypeText = require('./keyboard/typeText');
const handleElementExists = require('./data/elementExists');

// Export dưới dạng object với key là type của node
module.exports = {
  'openURL': handleOpenURL,
  'refreshPage': handleRefreshPage,
  'start': handleStart,
  'stop': handleStop,
  'click': handleClick,
  'typeText': handleTypeText,
  'elementExists': handleElementExists
};