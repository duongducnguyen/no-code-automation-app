// src/components/ContextMenu.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ContextMenu = ({ x, y, onDelete, onClose }) => {
  return (
    <div 
      className="fixed bg-white shadow-lg rounded-lg py-1 min-w-[120px] z-[1000] border"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
        onClick={onDelete}
      >
        <FontAwesomeIcon icon={faTrash} />
        Delete Node
      </button>
    </div>
  );
};

export default ContextMenu;
