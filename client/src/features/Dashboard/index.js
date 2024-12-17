import React, { useState, useRef, useEffect } from "react";
import Home from "./components/Home";
import Script from "./components/Script";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faChevronDown, 
  faKey, 
  faSignOutAlt,
  faCode
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/UserContext"; // Thêm import useUser

const Dashboard = () => 
{

  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useUser(); // Sử dụng useUser hook

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      key: "dashboard",
      icon: faHome,
      label: "Trang chủ",
      component: Home,
    },
    {
      key: "script",
      icon: faCode,
      label: "Kịch bản",
      component: Script,
    },
  ];

  const dropdownItems = [
    {
      icon: faKey,
      label: "Đổi Mật Khẩu",
      onClick: () => console.log("Change password"),
    },
    {
      icon: faSignOutAlt,
      label: "Đăng Xuất",
      onClick: () => console.log("Logout"),
    },
  ];

  const renderContent = () => {
    const menuItem = menuItems.find((item) => item.key === selectedMenu);
    if (menuItem) {
      const Component = menuItem.component;
      return <Component />;
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 flex justify-center items-center">
          <h1 className="text-2xl font-bold text-blue-600 tracking-wider">
            FLOWSCRIPT
          </h1>
        </div>
        <nav className="mt-4 px-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedMenu(item.key)}
              className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ease-in-out mb-1
                ${
                  selectedMenu === item.key
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <FontAwesomeIcon 
                icon={item.icon} 
                className={`${
                  selectedMenu === item.key ? "text-white" : "text-gray-500"
                }`}
              />
              <span className="ml-3 text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {menuItems.find((item) => item.key === selectedMenu)?.label}
              </h2>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <img
                  src="https://icons.veryicon.com/png/o/business/multi-color-financial-and-business-icons/user-139.png"
                  alt="User avatar"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-700">{user.email}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-gray-400 text-xs transition-transform duration-200 ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  {dropdownItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.onClick();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={item.icon} className="w-4 h-4 mr-3 text-gray-500" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;