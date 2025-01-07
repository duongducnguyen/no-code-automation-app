// client/src/components/nodes/navigation/GoBackNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const GoBackNode = ({ data }) => (
  <div className="node bg-blue-500 text-white border border-blue-800">
    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
    {data.label}
    <Handle type="target" position={Position.Left} style={{ background: 'neutral' }} className="handle" />      
    <Handle type="source" position={Position.Top} style={{ background: 'green' }} className="handle" id="success" />
    <Handle type="source" position={Position.Bottom} style={{ background: 'red' }} className="handle" id="fail" />
  </div>
);

export default GoBackNode;