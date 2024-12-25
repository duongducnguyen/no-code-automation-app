const path = require('path');
const chromedriver = require('chromedriver');

module.exports = {
  // Chrome driver configuration
  chromedriverPath: chromedriver.path,
  
  // Chrome options
  chromeOptions: [
    '--start-maximized',
    '--disable-infobars',
    '--disable-extensions',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-gpu',
    // Add more chrome options as needed
  ],

  // Timeouts
  timeouts: {
    implicit: 10000,      // Implicit wait timeout
    pageLoad: 30000,      // Page load timeout
    script: 30000,        // Script timeout
    element: 10000        // Element wait timeout
  },

  // Selenium configurations
  selenium: {
    baseUrl: process.env.BASE_URL || 'http://localhost',
    retries: 3,           // Number of retries for failed actions
    retryDelay: 1000,     // Delay between retries in milliseconds
  },

  // Browser window settings
  browser: {
    width: 1920,
    height: 1080,
    headless: process.env.NODE_ENV === 'production'
  },

  // Logging settings
  logging: {
    enabled: true,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    directory: path.join(process.cwd(), 'logs'),
  }
};