// src/features/Dashboard/components/Script.js

import React, { useEffect, useRef, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../../../assets/css/script.css';

const Script = () => 
{

  // ResizeObserver error handler
  useEffect(() => {
    const resizeObserverError = error => {
      if (error.message.includes('ResizeObserver loop')) {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div'
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay'
        );
        if (resizeObserverErr) {
          resizeObserverErr.style.display = 'none';
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.style.display = 'none';
        }
      }
    };

    window.addEventListener('error', resizeObserverError);
    return () => window.removeEventListener('error', resizeObserverError);
  }, []);
  
  // Custom Nodes
  const StartNode = ({ data }) => (
    <div className="node start-node">
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        className="handle"
      />
    </div>
  );

  const ProcessNode = ({ data }) => (
    <div className="node process-node">
      <Handle
        type="target"
        position={Position.Left}
        className="handle"
      />
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        className="handle"
      />
    </div>
  );


  const EndNode = ({ data }) => (
    <div className="node end-node">
      <Handle
        type="target"
        position={Position.Left}
        className="handle"
      />
      {data.label}
    </div>
  );

  // Node Types
  const nodeTypes = {
    start: StartNode,
    process: ProcessNode,
    end: EndNode
  };

  // Node Templates
  const nodeTemplates = [
    { type: 'start', label: 'Start' },
    { type: 'process', label: 'Process' },
    { type: 'end', label: 'End' }
  ];

  // States
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  const reactFlowWrapper = useRef(null);

  // Handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNewNode = useCallback((nodeType, nodeLabel) => {
    if (!reactFlowWrapper.current) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const nodeSpacing = 150;
    
    const position = {
      x: (nodes.length * nodeSpacing) + 50,
      y: reactFlowBounds.height / 2 - 25
    };

    const newNode = {
      id: `${nodes.length + 1}`,
      type: nodeType,
      position,
      data: { label: `${nodeLabel} ${nodes.length + 1}` }
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes]);


  // Styles
  const flowStyles = {
    background: '#f8f9fa',
    width: '100%',
    height: '100%'
  };

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 120px)',
      position: 'relative'
    }}>
      {/* Node Types Menu */}
      <div className="node-types-menu">
        <h3>Node Types</h3>
        {nodeTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => addNewNode(template.type, template.label)}
            className={`node-button ${template.type}`}
          >
            Add {template.label}
          </button>
        ))}
      </div>

      {/* Flow Container */}
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={flowStyles}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={4}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Script;