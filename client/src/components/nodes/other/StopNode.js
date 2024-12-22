// nodes/StopNode.jsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";

const StopNode = ({ data }) => (
  <div className="node end-node">
    <Handle type="target" position={Position.Left} className="handle" />
    <FontAwesomeIcon icon={faStop} className="mr-2" />
    {data.label}
  </div>
);

export default StopNode;