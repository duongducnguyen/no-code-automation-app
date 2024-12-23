import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import "reactflow/dist/style.css";
import "../../../assets/css/script.css";
import { nodeTypes, nodeCategories } from "../../../components/nodes";
import { v4 as uuidv4 } from 'uuid';
// Set app element for react-modal
Modal.setAppElement("#root");

const Script = () => 
{
  const [isRunning, setIsRunning] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowWrapper = useRef(null);

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


  // Check if node type already exists
  const hasNodeType = useCallback(
    (type) => {
      return nodes.some((node) => node.type === type);
    },
    [nodes]
  );

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
      console.log("connect");
  
      // Tạo một edge mới với thông tin chi tiết
      const newEdge = {
        id: params.id, // Tạo ID cho edge
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle, // Thêm sourceHandle
      };
  
      setEdges((eds) => {
        // Thêm edge mới vào danh sách edges hiện tại
        const newEdges = [...eds, newEdge];
        return newEdges;
      });
    },
    [setEdges] // Chỉ cần setEdges trong dependency array
  );

  const addNewNode = useCallback(
    (nodeType, nodeLabel) => 
      {
      // if (hasNodeType(nodeType)) {
        // console.warn(`Cannot add more than one ${nodeType} node`);
        // return;
      // }
  
      if (!reactFlowWrapper.current) return;
  
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: nodes.length * 150 + 50,
        y: reactFlowBounds.height / 2 - 25,
      };
  
      let nodeData = {
        label: nodeLabel,
        updateNodeData
      };
  
      if (nodeType === "openURL") {
        nodeData.url = "";
      } else if (nodeType === "variables") {
        nodeData.variables = [];
      }
  
      const newNode = {
        id: uuidv4(), // Sử dụng UUID để tạo ID duy nhất
        type: nodeType,
        position,
        data: nodeData,
      };
  
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, hasNodeType, updateNodeData]
  );

  // Automatically add the intial node when the component mounts
  React.useEffect(() => 
  {
  
    if (!hasNodeType("start")) 
    {
      addNewNode("start", "start");
    }
    if (!hasNodeType("variables")) 
    {
      addNewNode("variables", "variables");
    }
  }, [hasNodeType, addNewNode]);

  const handleStartSelenium = async () => {
    try {
      // Tạo flowData với dữ liệu đã được làm sạch

      console.log("Current nodes before starting:", nodes); // Debugging line
      
      const flowData = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          data: node.data, // Sử dụng trực tiếp dữ liệu đã được cấu trúc trong addNewNode
        })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          type: edge.type,
          sourceHandle: edge.sourceHandle, // Thêm sourceHandle vào dữ liệu JSON
          targetHandle: edge.targetHandle, // Thêm targetHandle vào dữ liệu JSON
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
      <div className="node-types-menu overflow-y-auto">
        <h3 className="font-semibold mb-3">NODES MENU</h3>

        {Object.entries(nodeCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2 px-2">
              {category.label}
            </h4>

            {category.nodes.map((node, index) => (
              <button
                key={`${categoryKey}-${index}`}
                onClick={() => addNewNode(node.type, node.label)}
                disabled={
                  (node.type === "start" && hasNodeType("start")) ||
                  (node.type === "stop" && hasNodeType("stop")) ||
                  (node.type === "variables" && hasNodeType("variables"))
                }
                className={`
                  node-button bg-${node.color}-500 w-full text-left
                  mb-2 p-2 rounded-md transition-colors
                  hover:bg-gray-100 flex items-center
                  ${
                    (node.type === "start" && hasNodeType("start")) ||
                    (node.type === "stop" && hasNodeType("stop")) ||
                    (node.type === "variables" && hasNodeType("variables"))
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
                title={node.description}
              >
                <span className="w-8">
                  <FontAwesomeIcon icon={node.icon} />
                </span>
                <span className="flex-1">{node.label}</span>
              </button>
            ))}

            {category.nodes.length === 0 && (
              <p className="text-sm text-gray-400 italic px-2">
                No nodes available
              </p>
            )}
          </div>
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
