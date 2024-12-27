import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faUpload,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import "reactflow/dist/style.css";
import "../../../assets/css/script.css";
import { nodeTypes, nodeCategories } from "../../../components/nodes";
import ContextMenu from "../../../components/ContextMenu";
import { v4 as uuidv4 } from "uuid";

// Set app element for react-modal
Modal.setAppElement("#root");

const Script = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowWrapper = useRef(null);
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    nodeId: null
  });
  
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

      const edgeType =
        params.sourceHandle === "fail" ? "fail-edge" : "success-edge";

      // Tạo một edge mới với thông tin chi tiết
      const newEdge = {
        id: uuidv4(), // Tạo ID cho edge
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle, // Thêm sourceHandle
        className: `animated-edge ${edgeType}`, // Thêm các class
        style: {
          strokeWidth: 2,
          // Có thể thêm các style inline khác ở đây
        },
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
    (nodeType, nodeLabel) => {
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
        updateNodeData,
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

  // Handler xóa node
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
  }, []);

  // Handler đóng context menu
  const handleCloseContextMenu = useCallback(() => {
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
  }, []);

  // Handler cho node context menu
  const onNodeContextMenu = useCallback((event, node) => {
    // Prevent default context menu
    event.preventDefault();
    
    // Kiểm tra nếu node là start hoặc variables thì không cho xóa
    if (node.type === 'start' || node.type === 'variables') {
      return;
    }

    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id
    });
  }, []);

  // Effect để handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.show) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.show, handleCloseContextMenu]);

  // Automatically add the intial node when the component mounts
  React.useEffect(() => {
    if (!hasNodeType("start")) {
      addNewNode("start", "start");
    }
    if (!hasNodeType("variables")) {
      addNewNode("variables", "variables");
    }
  }, [hasNodeType, addNewNode]);

  const handleStartSelenium = async () => {
    try {
      // Tạo flowData với dữ liệu đã được làm sạch
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

      const flowDataString = JSON.stringify(flowData);

      console.log("Flow Execution Data:", flowDataString);

      const result = await window.electronAPI.startSelenium(flowDataString);

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

  const handleRestoreFlow = useCallback(() => {
    // Tạo input element ẩn để chọn file
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const flowData = JSON.parse(event.target.result);

            // Kiểm tra và đặt lại nodes
            if (flowData.nodes) {
              const restoredNodes = flowData.nodes.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  updateNodeData, // Thêm lại function updateNodeData
                },
              }));
              setNodes(restoredNodes);
            }

            // Kiểm tra và đặt lại edges
            if (flowData.edges) {
              const restoredEdges = flowData.edges.map((edge) => ({
                ...edge,
                id: edge.id || uuidv4(), // Đảm bảo edge có id
                className:
                  edge.sourceHandle === "fail"
                    ? "animated-edge fail-edge"
                    : "animated-edge success-edge",
              }));
              setEdges(restoredEdges);
            }
          } catch (error) {
            console.error("Error parsing flow data:", error);
            // Có thể thêm thông báo lỗi cho người dùng ở đây
          }
        };

        reader.readAsText(file);
      }
    };

    fileInput.click();
  }, [setNodes, setEdges]);

  const handleExportFlow = useCallback(() => {
    try {
      // Tạo flowData với cấu trúc tương tự như khi start selenium
      const flowData = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: {
            ...node.data,
            updateNodeData: undefined, // Loại bỏ function không cần thiết khi export
          },
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          className: edge.className,
        })),
      };

      // Chuyển đổi thành chuỗi JSON
      const flowDataString = JSON.stringify(flowData, null, 2);

      // Tạo Blob từ chuỗi JSON
      const blob = new Blob([flowDataString], { type: "application/json" });

      // Tạo URL cho blob
      const url = window.URL.createObjectURL(blob);

      // Tạo element a để download
      const downloadLink = document.createElement("a");
      downloadLink.href = url;

      // Tạo tên file với timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      downloadLink.download = `flow-export-${timestamp}.json`;

      // Thêm link vào document, click để download, và xóa link
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Giải phóng URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting flow:", error);
      // Có thể thêm thông báo lỗi cho người dùng ở đây
    }
  }, [nodes, edges]);

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

        <button
          onClick={handleExportFlow}
          disabled={isRunning || nodes.length === 0} // Disable nếu không có nodes hoặc đang chạy
          className={`
      px-4 py-2 rounded-md font-semibold text-white
      transition-colors duration-300 flex items-center
      ${
        isRunning || nodes.length === 0
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-purple-500 hover:bg-purple-600 active:bg-purple-700"
      }
    `}
        >
          <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export Flow
        </button>

        <button
          onClick={handleRestoreFlow}
          disabled={isRunning}
          className={`
      px-4 py-2 rounded-md font-semibold text-white
      transition-colors duration-300 flex items-center
      ${
        isRunning
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
      }
    `}
        >
          <FontAwesomeIcon icon={faUpload} className="mr-2" /> Restore Flow
        </button>
      </div>

{/* Node Types Menu */}
<div className="node-types-menu">
  {/* Header cố định */}
  <div className="node-types-menu-header">
    <h3 className="font-semibold">NODES MENU</h3>
  </div>
  
  {/* Content có thể cuộn */}
  <div className="node-types-menu-content">
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
</div>

      {/* Flow Container */}
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeContextMenu={onNodeContextMenu} // Thêm handler cho context menu
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



      {/* Context Menu */}
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={() => handleDeleteNode(contextMenu.nodeId)}
          onClose={handleCloseContextMenu}
        />
      )}

    </div>



  );
};

export default Script;
