// client/src/components/nodes/navigation/CloseTabNode.js
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    padding: '20px',
    borderRadius: '8px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
};

const CloseTabNode = ({ data, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [closeType, setCloseType] = useState(data.closeType || 'current');
  const [tabValue, setTabValue] = useState(data.tabValue || '');

  const handleDoubleClick = () => {
    setModalIsOpen(true);
  };

  const handleSave = () => {
    data.updateNodeData(id, { 
      ...data, 
      closeType,
      tabValue
    });
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="node bg-blue-500 text-white border border-blue-800" onDoubleClick={handleDoubleClick}>
        <FontAwesomeIcon icon={faTimes} className="mr-2" />
        {data.label} {closeType === 'specific' && `(Tab: ${tabValue})`}
        
        <Handle type="target" position={Position.Left} style={{ background: 'neutral' }} className="handle" />      
        <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
        <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Close Tab Settings"
      >
        <h2 className="text-xl font-bold mb-4">Close Tab Settings</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Close Type</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="current"
                checked={closeType === 'current'}
                onChange={(e) => setCloseType(e.target.value)}
                className="mr-2"
              />
              Current Tab
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="specific"
                checked={closeType === 'specific'}
                onChange={(e) => setCloseType(e.target.value)}
                className="mr-2"
              />
              Specific Tab
            </label>
          </div>
        </div>

        {closeType === 'specific' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tab Index
            </label>
            <input
              type="number"
              value={tabValue}
              onChange={(e) => setTabValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              placeholder="Enter tab index (0, 1, 2...)"
            />
          </div>
        )}

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

export default CloseTabNode;