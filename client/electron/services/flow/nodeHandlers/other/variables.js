class Variables {
  constructor() {
    this.variables = new Map();
  }

  setVariables(variablesList) {
    if (!Array.isArray(variablesList)) return;
    
    variablesList.forEach(({name, value}) => {
      if (name) {
        this.variables.set(name, value); 
      }
    });
    console.log('Variables initialized:', Object.fromEntries(this.variables));
  }

  getValue(name) {
    return this.variables.get(name);
  }

  getAll() {
    return Object.fromEntries(this.variables);
  }

  // Thêm phương thức kiểm tra biến tồn tại
  hasVariable(name) {
    return this.variables.has(name);
  }

  // Thêm phương thức cập nhật giá trị
  updateValue(name, newValue) {
    if (!this.hasVariable(name)) {
      throw new Error(`Variable ${name} does not exist`);
    }
    this.variables.set(name, newValue);
    return true;
  }
}

module.exports = {
  Variables
};