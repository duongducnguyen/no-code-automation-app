import React from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const StartNode = ({ data }) => (
  <div className="node bg-green-500 text-white border border-green-800">
    <FontAwesomeIcon icon={faPlay} className="mr-2" />
    {data.label}
    <Handle type="source" position={Position.Right} style={{ background: 'green' }} className="handle" id="success" />
  </div>
);

export default StartNode;