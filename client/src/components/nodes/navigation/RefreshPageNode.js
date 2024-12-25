// nodes/StopNode.jsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

const RefreshPageNode = ({ data }) => (
  <div className="node bg-blue-500 text-white border border-blue-800">
    <Handle type="target" position={Position.Left} style={{ background: 'neutral' }} className="handle" />      
    <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
    <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />
    <FontAwesomeIcon icon={faRefresh} className="mr-2" />
    {data.label}
  </div>
);

export default RefreshPageNode;