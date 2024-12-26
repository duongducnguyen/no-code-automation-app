const nodeHandlers = require('./nodeHandlers');
const SeleniumDriver = require('../selenium/driver');
const { Variables } = require('./nodeHandlers/other/variables');

class FlowExecutor 
{

  constructor(flowData) 
  {
    this.flowData = flowData;
    this.nodesMap = new Map(flowData.nodes.map(node => [node.id, node]));

    // Đọc variables từ node variables
    this.variables = new Variables();
    const variablesNode = flowData.nodes.find(node => node.type === 'variables');
    if (variablesNode?.data?.variables) 
    {
      this.variables.setVariables(variablesNode.data.variables);
    }
    
  }

  async execute() 
  {

    try 
    {
      const driver = await SeleniumDriver.getInstance();
      let currentNode = this.flowData.nodes.find(node => node.type === 'start');

      while (currentNode && currentNode.type !== 'stop') 
      {
        const handler = nodeHandlers[currentNode.type];
        
        if (!handler || typeof handler !== 'function') 
        {
          throw new Error(`Invalid or missing handler for node type: ${currentNode.type}`);
        }

        const result = await handler(driver, currentNode.data);
        
        const nextEdge = this.flowData.edges.find(
          edge => edge.source === currentNode.id &&
          edge.sourceHandle === (result.success ? 'success' : 'fail')
        );

        currentNode = nextEdge ? this.nodesMap.get(nextEdge.target) : null;
      }

      return { success: true };

    } catch (error) 
    {

      await SeleniumDriver.quit();
      return { success: false, error: error.message };

    }

  }
}

module.exports = FlowExecutor;