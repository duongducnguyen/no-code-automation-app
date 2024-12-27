const { By, until } = require('selenium-webdriver');

async function handleGetText(driver, data, variables) { // Thêm tham số variables
  try {
    // Kiểm tra dữ liệu đầu vào
    if (!data.selector) {
      throw new Error('Selector is required');
    }
    if (!data.outputVariable) {
      throw new Error('Output variable is required');
    }

    // Kiểm tra xem biến output có tồn tại trong Variables không
    if (!variables.hasVariable(data.outputVariable)) {
      throw new Error(`Variable ${data.outputVariable} has not been defined in Variables node`);
    }

    // Tìm element dựa trên loại selector
    let element;
    switch (data.selectorType) {
      case 'xpath':
        element = await driver.wait(
          until.elementLocated(By.xpath(data.selector)),
          10000
        );
        break;
      
      case 'css':
        element = await driver.wait(
          until.elementLocated(By.css(data.selector)),
          10000
        );
        break;
      
      case 'text':
        element = await driver.wait(
          until.elementLocated(By.xpath(`//*[contains(text(), '${data.selector}')]`)),
          10000
        );
        break;

      default:
        throw new Error('Invalid selector type');
    }

    // Lấy text từ element
    const text = await element.getText();
    
    // Cập nhật giá trị biến
    await variables.updateValue(data.outputVariable, text);
    
    return {
      success: true,
      data: {
        text,
        variable: data.outputVariable,
        allVariables: variables.getAll()
      }
    };

  } catch (error) {
    console.error('GetText error:', error);
    return {
      success: false,
      error: error.message,
      type: 'GET_TEXT_ERROR'
    };
  }
}

module.exports = handleGetText;