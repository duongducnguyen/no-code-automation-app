import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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

const ElementExistsNode = ({ data, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [existsSettings, setExistsSettings] = useState({
    selectorType: data.selectorType || 'xpath',
    selector: data.selector || '',
    timeout: data.timeout || 10,
    waitForVisible: data.waitForVisible || false,
    inverse: data.inverse || false
  });

  const handleDoubleClick = () => {
    setModalIsOpen(true);
  };

  const handleSave = () => {
    data.updateNodeData(id, { ...data, ...existsSettings });
    setModalIsOpen(false);
  };

  const handleChange = (field, value) => {
    setExistsSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <div 
        className="node bg-blue-500 text-white border border-blue-800 p-2 rounded"
        onDoubleClick={handleDoubleClick}
      >
        <FontAwesomeIcon icon={faSearch} className="mr-2" />
        {data.label}
        <Handle type="target" position={Position.Left} style={{ background: 'neutral' }} className="handle" />      
        <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
        <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Element Exists Settings"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Element Exists Settings</h2>

          {/* Selector Type */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selector type</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selectorType"
                  value="xpath"
                  checked={existsSettings.selectorType === 'xpath'}
                  onChange={(e) => handleChange('selectorType', e.target.value)}
                  className="mr-2"
                />
                XPath
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selectorType"
                  value="css"
                  checked={existsSettings.selectorType === 'css'}
                  onChange={(e) => handleChange('selectorType', e.target.value)}
                  className="mr-2"
                />
                CSS
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selectorType"
                  value="text"
                  checked={existsSettings.selectorType === 'text'}
                  onChange={(e) => handleChange('selectorType', e.target.value)}
                  className="mr-2"
                />
                Text
              </label>
            </div>
          </div>

          {/* Selector Input */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selector</h3>
            <input
              type="text"
              value={existsSettings.selector}
              onChange={(e) => handleChange('selector', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter selector..."
            />
          </div>

          {/* Wait for Visible */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={existsSettings.waitForVisible}
                onChange={(e) => handleChange('waitForVisible', e.target.checked)}
                className="mr-2"
              />
              Wait for element to be visible
            </label>
          </div>

          {/* Inverse Check */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={existsSettings.inverse}
                onChange={(e) => handleChange('inverse', e.target.checked)}
                className="mr-2"
              />
              Inverse check (Element does NOT exist)
            </label>
          </div>

          {/* Timeout */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Timeout (seconds)</h3>
            <input
              type="number"
              value={existsSettings.timeout}
              onChange={(e) => handleChange('timeout', parseInt(e.target.value) || 10)}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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

export default ElementExistsNode;