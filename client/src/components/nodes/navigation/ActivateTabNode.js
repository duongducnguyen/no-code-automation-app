import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsLeftRight, faTimes } from "@fortawesome/free-solid-svg-icons";
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
    padding: '0',
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
};

const ActivateTabNode = ({ data, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectType, setSelectType] = useState(data.selectType || 'index');
  const [tabValue, setTabValue] = useState(data.tabValue || '');

  const handleDoubleClick = () => {
    setModalIsOpen(true);
  };

  const handleSave = () => {
    data.updateNodeData(id, { 
      ...data, 
      selectType,
      tabValue
    });
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="node bg-blue-500 text-white border border-blue-800" onDoubleClick={handleDoubleClick}>
        <FontAwesomeIcon icon={faArrowsLeftRight} className="mr-2" />
        {data.label} {tabValue && `(${selectType === 'index' ? `Tab index: ${tabValue}` : `Contains: ${tabValue}`})`}
        
        <Handle type="target" position={Position.Left} style={{ background: 'neutral' }} className="handle" />      
        <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
        <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />

      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Activate Tab Settings"
      >
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-indigo-50 rounded flex items-center justify-center mr-3">
            <FontAwesomeIcon icon={faArrowsLeftRight} className="text-indigo-500" />
          </div>
          <h2 className="text-lg font-medium flex-1">Activate tab</h2>
          <button 
            onClick={() => setModalIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block font-medium mb-2">Select type</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={selectType === 'index'}
                  onChange={() => setSelectType('index')}
                  className="text-indigo-500 focus:ring-indigo-500"
                />
                <span>Index</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={selectType === 'contains'}
                  onChange={() => setSelectType('contains')}
                  className="text-indigo-500 focus:ring-indigo-500"
                />
                <span>Contains string</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">
              {selectType === 'index' ? 'Select tab number' : 'Match pattern includes in page url'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={tabValue}
                onChange={(e) => setTabValue(e.target.value)}
                className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                placeholder={selectType === 'index' ? '0' : 'E.g: https://newtab.com'}
              />
              {tabValue && (
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 text-white rounded flex items-center justify-center hover:bg-orange-600"
                  onClick={() => setTabValue('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          >
            Save
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ActivateTabNode;