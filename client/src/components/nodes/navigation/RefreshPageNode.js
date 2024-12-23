// nodes/StopNode.jsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

const RefreshPageNode = ({ data }) => (
  <div className="node bg-blue-500 text-white border border-blue-800">
    <Handle type="target" position={Position.Left} className="handle" />
    <Handle type="source" position={Position.Right} className="handle" />
    <FontAwesomeIcon icon={faRefresh} className="mr-2" />
    {data.label}
  </div>
);

export default RefreshPageNode;