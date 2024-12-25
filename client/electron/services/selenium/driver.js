const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { ServiceBuilder } = require('selenium-webdriver/chrome');
const config = require('./config');

class SeleniumDriver 
{
  
  static instance = null;

  static async getInstance() {
    if (!this.instance) {
      try {
        const options = new chrome.Options()
          .addArguments(...config.chromeOptions);

        if (config.browser.headless) {
          options.addArguments('--headless');
        }

        const service = new ServiceBuilder(config.chromedriverPath);

        this.instance = await new webdriver.Builder()
          .forBrowser('chrome')
          .setChromeOptions(options)
          .setChromeService(service)
          .build();

        // Set timeouts
        await this.instance.manage().setTimeouts({
          implicit: config.timeouts.implicit,
          pageLoad: config.timeouts.pageLoad,
          script: config.timeouts.script
        });

        // Set window size
        await this.instance.manage().window().setRect({
          width: config.browser.width,
          height: config.browser.height
        });

        if (config.logging.enabled) {
          console.log('Selenium WebDriver instance created successfully');
        }

      } catch (error) {
        console.error('Error creating Selenium WebDriver instance:', error);
        throw error;
      }
    }
    return this.instance;
  }

  static async quit() {
    if (this.instance) {
      try {
        await this.instance.quit();
        this.instance = null;
        if (config.logging.enabled) {
          console.log('Selenium WebDriver instance closed successfully');
        }
      } catch (error) {
        console.error('Error closing Selenium WebDriver instance:', error);
        throw error;
      }
    }
  }

}

module.exports = SeleniumDriver;