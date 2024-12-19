import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faGlobe } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';
import "reactflow/dist/style.css";
import "../../../assets/css/script.css";

// Set app element for react-modal
Modal.setAppElement('#root');

// Modal styles
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
    borderRadius: '8px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
};

// Custom Nodes
const StartNode = ({ data }) => (
  <div className="node start-node">
    <FontAwesomeIcon icon={faPlay} className="mr-2" />
    {data.label}
    <Handle type="source" position={Position.Right} className="handle" />
  </div>
);

const OpenURLNode = ({ data, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [url, setUrl] = useState(data.url || '');

  const handleDoubleClick = () => {
    setModalIsOpen(true);
  };

  const handleSave = () => {
    data.updateNodeData(id, { ...data, url });
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="node process-node" onDoubleClick={handleDoubleClick}>
        <Handle type="target" position={Position.Left} className="handle" />
        <FontAwesomeIcon icon={faGlobe} className="mr-2" />
        {data.label} {data.url && `(${data.url})`}
        <Handle type="source" position={Position.Right} className="handle" />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Enter URL"
      >
        <h2 className="text-xl font-bold mb-4">Enter URL</h2>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="https://example.com"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

const StopNode = ({ data }) => (
  <div className="node end-node">
    <Handle type="target" position={Position.Left} className="handle" />
    <FontAwesomeIcon icon={faStop} className="mr-2" />
    {data.label}
  </div>
);

// Node Types
const nodeTypes = {
  start: StartNode,
  openURL: OpenURLNode,
  stop: StopNode,
};

const Script = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowWrapper = useRef(null);

  // Check if node type already exists
  const hasNodeType = useCallback((type) => {
    return nodes.some(node => node.type === type);
  }, [nodes]);

  // Update node data function
  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, []);

  // ResizeObserver error handler
  React.useEffect(() => {
    const resizeObserverError = (error) => {
      if (error.message.includes("ResizeObserver loop")) {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.style.display = "none";
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.style.display = "none";
        }
      }
    };

    window.addEventListener("error", resizeObserverError);
    return () => window.removeEventListener("error", resizeObserverError);
  }, []);

  // Node Templates
  const nodeTemplates = [
    { type: "start", label: "Start", icon: faPlay },
    { type: "openURL", label: "Open URL", icon: faGlobe },
    { type: "stop", label: "Stop", icon: faStop },
  ];

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
    (params) => {
      console.log("New connection:", params);
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        console.log("Current flow:", {
          nodes: nodes,
          edges: newEdges,
        });
        return newEdges;
      });
    },
    [nodes]
  );

  const addNewNode = useCallback(
    (nodeType, nodeLabel) => {
      if (
        (nodeType === "start" && hasNodeType("start")) ||
        (nodeType === "stop" && hasNodeType("stop"))
      ) {
        console.warn(`Cannot add more than one ${nodeType} node`);
        return;
      }

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: nodes.length * 150 + 50,
        y: reactFlowBounds.height / 2 - 25,
      };

      const newNode = {
        id: `${nodes.length + 1}`,
        type: nodeType,
        position,
        data: { 
          label: nodeLabel,
          updateNodeData,
          url: ''
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, hasNodeType, updateNodeData]
  );

  const handleStartSelenium = async () => {
    try {
      // Tạo flowData với dữ liệu đã được làm sạch
      const flowData = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          data: {
            label: node.data.label,
            url: node.data.url || '',
            // Loại bỏ hàm updateNodeData vì không thể serialize
          }
        })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          type: edge.type,
        })),
      };
  
      console.log("Flow Execution Data:", JSON.stringify(flowData, null, 2));
  
      const result = await window.electronAPI.startSelenium(flowData);
      if (result.success) {
        setIsRunning(true);
      } else {
        console.error("Failed to start Selenium:", result.error);
      }
    } catch (error) {
      console.error("Error starting Selenium:", error);
    }
  };

  const handleStopSelenium = async () => {
    try {
      const result = await window.electronAPI.stopSelenium();
      if (result.success) {
        setIsRunning(false);
      } else {
        console.error("Failed to stop Selenium:", result.error);
      }
    } catch (error) {
      console.error("Error stopping Selenium:", error);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] relative">
      {/* Control Buttons */}
      <div className="absolute top-5 right-5 flex gap-3 z-10">
        <button
          onClick={handleStartSelenium}
          disabled={isRunning}
          className={`
            px-4 py-2 rounded-md font-semibold text-white
            transition-colors duration-300 flex items-center
            ${
              isRunning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 active:bg-green-700"
            }
          `}
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" /> Start Script
        </button>

        <button
          onClick={handleStopSelenium}
          disabled={!isRunning}
          className={`
            px-4 py-2 rounded-md font-semibold text-white
            transition-colors duration-300 flex items-center
            ${
              !isRunning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 active:bg-red-700"
            }
          `}
        >
          <FontAwesomeIcon icon={faStop} className="mr-2" /> Stop Script
        </button>
      </div>

      {/* Node Types Menu */}
      <div className="node-types-menu">
        <h3 className="font-semibold mb-3">Add Node</h3>
        {nodeTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => addNewNode(template.type, template.label)}
            disabled={
              (template.type === "start" && hasNodeType("start")) ||
              (template.type === "stop" && hasNodeType("stop"))
            }
            className={`
              node-button ${template.type}
              ${
                (template.type === "start" && hasNodeType("start")) ||
                (template.type === "stop" && hasNodeType("stop"))
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
          >
            <FontAwesomeIcon icon={template.icon} className="mr-2" />
            <span className="ml-2">Add {template.label}</span>
          </button>
        ))}
      </div>

      {/* Flow Container */}
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
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