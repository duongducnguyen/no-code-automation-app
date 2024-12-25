class Variables 
{
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
}

module.exports = {
  Variables
};