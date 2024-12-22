import React from 'react';
import { Handle, Position } from 'reactflow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const StartNode = ({ data }) => (
  <div className="node start-node">
    <FontAwesomeIcon icon={faPlay} className="mr-2" />
    {data.label}
    <Handle type="source" position={Position.Right} className="handle" />
  </div>
);

export default StartNode;