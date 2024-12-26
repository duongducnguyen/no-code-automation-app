import React, { useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useVariables } from "../../../context/VariablesContext";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    padding: "20px",
    borderRadius: "8px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

  const VariablesNode = ({ data, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [variables, setVariables] = useState(data.variables || []);
  const { setGlobalVariables } = useVariables();

  const handleDoubleClick = () => {
    setModalIsOpen(true);
  };

  const handleAddVariable = () => {
    setVariables([...variables, { name: "", value: "" }]);
  };

  const handleRemoveVariable = (index) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const handleChangeVariable = (index, field, value) => {
    const newVariables = [...variables];
    newVariables[index][field] = value;
    setVariables(newVariables);
  };

  const handleSave = () => {
    data.updateNodeData(id, { ...data, variables });
    setGlobalVariables(variables); // Cập nhật global variables
    setModalIsOpen(false);
  };

  return (
    <>
      <div
        className="node bg-yellow-500 text-white border border-yellow-800 p-2 rounded"
        onDoubleClick={handleDoubleClick}
      >
        <FontAwesomeIcon icon={faCog} className="mr-2" />
        Variables
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Variables"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-blue-500 mr-2">{"{x}"}</span> Variables
        </h2>
        <h3 className="font-semibold mb-2">Constant variables</h3>
        <div className="flex flex-col mb-4">
          {variables.map((variable, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={variable.name}
                onChange={(e) =>
                  handleChangeVariable(index, "name", e.target.value)
                }
                className="w-2/5 p-2 border border-gray-300 rounded mr-1"
                placeholder="Name"
              />
              <span className="mx-1">=</span>
              <input
                type="text"
                value={variable.value}
                onChange={(e) =>
                  handleChangeVariable(index, "value", e.target.value)
                }
                className="w-2/5 p-2 border border-gray-300 rounded mr-2"
                placeholder="Value"
              />
              <button
                onClick={() => handleRemoveVariable(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>


        <div className="flex justify-center mb-4">
          <button
            onClick={handleAddVariable}
            className="flex items-center px-4 py-2 border border-dashed border-gray-400 text-gray-600 rounded hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create
          </button>
        </div>


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

export default VariablesNode;
