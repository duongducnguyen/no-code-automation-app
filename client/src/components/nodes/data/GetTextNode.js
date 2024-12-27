// components/nodes/GetTextNode.js
import React, { useState } from "react";
import { Handle, Position } from 'reactflow';
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useVariables } from "../../../context/VariablesContext";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    padding: "20px",
    borderRadius: "8px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

const GetTextNode = ({ data, id }) => 
{
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectorType, setSelectorType] = useState("xpath");
  const [selector, setSelector] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const { globalVariables } = useVariables();

  const handleDoubleClick = () => {
    setModalIsOpen(true);
  };

  const handleSave = () => {
    data.updateNodeData(id, {
      ...data,
      selectorType,
      selector,
      outputVariable: selectedVariable
    });
    setModalIsOpen(false);
  };

  return (
    <>
      <div 
        className="node bg-blue-500 text-white border border-blue-800 p-2 rounded"
        onDoubleClick={handleDoubleClick}
      >
        <FontAwesomeIcon icon={faFont} className="mr-2" />
        {data.label}
        <Handle type="target" position={Position.Left} style={{ background: 'neutral' }} className="handle" />      
        <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
        <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Get Text Settings"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Get Text</h2>
          <button 
            onClick={() => setModalIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="space-y-4">

          {/* Selector Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Selector type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="xpath"
                  checked={selectorType === "xpath"}
                  onChange={(e) => setSelectorType(e.target.value)}
                  className="mr-2"
                />
                XPath
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="css"
                  checked={selectorType === "css"}
                  onChange={(e) => setSelectorType(e.target.value)}
                  className="mr-2"
                />
                CSS
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="text"
                  checked={selectorType === "text"}
                  onChange={(e) => setSelectorType(e.target.value)}
                  className="mr-2"
                />
                Text
              </label>
            </div>
          </div>

          {/* Selector Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Selector
            </label>
            <input
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter selector"
            />
          </div>

          {/* Output Variable Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Output variable
            </label>
            <select
              value={selectedVariable}
              onChange={(e) => setSelectedVariable(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Please Select</option>
              {globalVariables.map((variable, index) => (
                <option key={index} value={variable.name}>
                  {variable.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
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
        </div>
      </Modal>
    </>
  );
};

export default GetTextNode;