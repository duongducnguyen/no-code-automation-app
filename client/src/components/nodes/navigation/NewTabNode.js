// components/nodes/NewTabNode.jsx
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faTimes } from "@fortawesome/free-solid-svg-icons";
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
    border: 'none',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
};

const NewTabNode = ({ data, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [url, setUrl] = useState(data.url || '');
  const [waitTime, setWaitTime] = useState(data.waitTime || 0);
  const [waitForNavigation, setWaitForNavigation] = useState(data.waitForNavigation || 'networkidle2');

  const handleDoubleClick = () => {
    setModalIsOpen(true);
  };

  const handleSave = () => {
    data.updateNodeData(id, { 
      ...data, 
      url,
      waitTime,
      waitForNavigation
    });
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="node bg-blue-500 text-white border border-blue-800" onDoubleClick={handleDoubleClick}>
        <FontAwesomeIcon icon={faSquarePlus} className="mr-2" />
        {data.label} {data.url && `(${data.url})`}
        
        <Handle type="target" position={Position.Left} style={{ background: 'neutral' }} className="handle" />      
        <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
        <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="New Tab Settings"
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faSquarePlus} className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">New tab</h2>
          </div>
          <div className="flex gap-3">
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setModalIsOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Url</label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 pr-8 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="https://example.com"
              />
              {url && (
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setUrl('')}
                >
                  <FontAwesomeIcon icon={faTimes} size="sm" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Wait time (milliseconds) - Default is wait until page loaded
            </label>
            <div className="relative">
              <input
                type="number"
                value={waitTime}
                onChange={(e) => setWaitTime(e.target.value)}
                className="w-full p-2 pr-8 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="0"
              />
              {waitTime > 0 && (
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setWaitTime(0)}
                >
                  <FontAwesomeIcon icon={faTimes} size="sm" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Wait for navigation</label>
            <div className="grid grid-cols-2 gap-3">
              {['load', 'domcontentloaded', 'networkidle0', 'networkidle2'].map((option) => (
                <label key={option} className="flex items-center space-x-2 text-sm">
                  <input
                    type="radio"
                    name="waitForNavigation"
                    value={option}
                    checked={waitForNavigation === option}
                    onChange={(e) => setWaitForNavigation(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 capitalize">
                    {option === 'domcontentloaded' ? 'DOMContentLoaded' : 
                     option === 'networkidle0' ? 'NetworkIdle0' :
                     option === 'networkidle2' ? 'NetworkIdle2' : 'Load'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </Modal>
    </>
  );
};

export default NewTabNode;