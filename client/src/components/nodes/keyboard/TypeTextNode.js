import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";

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

const TypeTextNode = ({ data, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [typeSettings, setTypeSettings] = useState({
    text: data.text || '',
    selectorType: data.selectorType || 'xpath',
    selector: data.selector || '',
    typeAsHuman: data.typeAsHuman || true,
    speed: data.speed || 3,
    timeout: data.timeout || 10
  });

  const handleDoubleClick = () => {
    setModalIsOpen(true);
  };

  const handleSave = () => {
    data.updateNodeData(id, { ...data, ...typeSettings });
    setModalIsOpen(false);
  };

  const handleChange = (field, value) => {
    setTypeSettings(prev => ({
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
        <FontAwesomeIcon icon={faKeyboard} className="mr-2" />
        {data.label}
        <Handle type="target" position={Position.Left} style={{ background: 'neutral' }} className="handle" />      
        <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
        <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Type Text Settings"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Type Text Settings</h2>

          {/* Text Input */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Text</h3>
            <textarea
              value={typeSettings.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
            />
          </div>

          {/* Selector Type */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selector type (Optional)</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selectorType"
                  value="xpath"
                  checked={typeSettings.selectorType === 'xpath'}
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
                  checked={typeSettings.selectorType === 'css'}
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
                  checked={typeSettings.selectorType === 'text'}
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
              value={typeSettings.selector}
              onChange={(e) => handleChange('selector', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Type as human */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={typeSettings.typeAsHuman}
                onChange={(e) => handleChange('typeAsHuman', e.target.checked)}
                className="mr-2"
              />
              Type as human
            </label>
          </div>

          {/* Speed Slider */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Speed</h3>
            <input
              type="range"
              min="1"
              max="5"
              value={typeSettings.speed}
              onChange={(e) => handleChange('speed', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Timeout */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Timeout (seconds)</h3>
            <input
              type="number"
              value={typeSettings.timeout}
              onChange={(e) => handleChange('timeout', parseInt(e.target.value) || 10)}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
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

export default TypeTextNode;