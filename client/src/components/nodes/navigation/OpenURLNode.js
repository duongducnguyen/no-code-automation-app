import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';

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

      <div className="node bg-blue-500 text-white border border-blue-800" onDoubleClick={handleDoubleClick}>
        <FontAwesomeIcon icon={faGlobe} className="mr-2" />
        {data.label} {data.url && `(${data.url})`}

        <Handle type="target" position={Position.Left} style={{ background: 'green' }} className="handle" />      
        <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
        <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />

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

export default OpenURLNode;