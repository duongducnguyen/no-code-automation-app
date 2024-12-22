// nodes/StopNode.jsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

const RefreshPage = ({ data }) => (
  <div className="node process-node">
    <Handle type="target" position={Position.Left} className="handle" />
    <FontAwesomeIcon icon={faRefresh} className="mr-2" />
    {data.label}
  </div>
);

export default RefreshPage;