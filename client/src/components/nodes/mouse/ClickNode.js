import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";

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

const ClickNode = ({ data, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clickSettings, setClickSettings] = useState({
    button: data.button || 'left',
    selectBy: data.selectBy || 'selector',
    selectorType: data.selectorType || 'xpath',
    selector: data.selector || '',
    clickCount: data.clickCount || 1,
    timeout: data.timeout || 10
  });

  const handleDoubleClick = () => {
    setModalIsOpen(true);
  };

  const handleSave = () => {
    data.updateNodeData(id, { ...data, ...clickSettings });
    setModalIsOpen(false);
  };

  const handleChange = (field, value) => {
    setClickSettings(prev => ({
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
        <FontAwesomeIcon icon={faHandPointer} className="mr-2" />
        {data.label}
        <Handle type="target" position={Position.Left} style={{ background: 'neutral' }} className="handle" />      
        <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
        <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Click Settings"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Click Settings</h2>
          
          {/* Button Options */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Button</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="button"
                  value="left"
                  checked={clickSettings.button === 'left'}
                  onChange={(e) => handleChange('button', e.target.value)}
                  className="mr-2"
                />
                Left
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="button"
                  value="right"
                  checked={clickSettings.button === 'right'}
                  onChange={(e) => handleChange('button', e.target.value)}
                  className="mr-2"
                />
                Right
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="button"
                  value="center"
                  checked={clickSettings.button === 'center'}
                  onChange={(e) => handleChange('button', e.target.value)}
                  className="mr-2"
                />
                Center
              </label>
            </div>
          </div>

          {/* Select by Options */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Select by</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selectBy"
                  value="selector"
                  checked={clickSettings.selectBy === 'selector'}
                  onChange={(e) => handleChange('selectBy', e.target.value)}
                  className="mr-2"
                />
                Selector
              </label>
            </div>
          </div>

          {/* Selector Type */}
          {clickSettings.selectBy === 'selector' && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Selector type</h3>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="selectorType"
                    value="xpath"
                    checked={clickSettings.selectorType === 'xpath'}
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
                    checked={clickSettings.selectorType === 'css'}
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
                    checked={clickSettings.selectorType === 'text'}
                    onChange={(e) => handleChange('selectorType', e.target.value)}
                    className="mr-2"
                  />
                  Text
                </label>
              </div>
            </div>
          )}

          {/* Selector Input */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selector</h3>
            <input
              type="text"
              value={clickSettings.selector}
              onChange={(e) => handleChange('selector', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Click Count */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Click count</h3>
            <div className="flex items-center">
              <button 
                onClick={() => handleChange('clickCount', Math.max(1, clickSettings.clickCount - 1))}
                className="px-3 py-1 border border-gray-300 rounded-l"
              >
                -
              </button>
              <input
                type="number"
                value={clickSettings.clickCount}
                onChange={(e) => handleChange('clickCount', parseInt(e.target.value) || 1)}
                className="w-20 p-2 border-t border-b border-gray-300 text-center"
                min="1"
              />
              <button 
                onClick={() => handleChange('clickCount', clickSettings.clickCount + 1)}
                className="px-3 py-1 border border-gray-300 rounded-r"
              >
                +
              </button>
            </div>
          </div>

          {/* Timeout */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Timeout (seconds)</h3>
            <input
              type="number"
              value={clickSettings.timeout}
              onChange={(e) => handleChange('timeout', parseInt(e.target.value) || 10)}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
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

export default ClickNode;