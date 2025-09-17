import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          {/* Logo */}
          {/* <div className="flex-shrink-0">
            <span className="text-[#52D3D8] text-xl font-bold">TimeManager</span>
          </div> */}

          {/* Desktop Menu */}
          <div className="hidden md:block">
            
            <div className="hidden md:block">
              <ul className="ml-10 flex items-center space-x-12">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `transition-colors duration-300 ${
                        isActive
                          ? "text-[#52D3D8]"
                          : "text-white hover:text-[#52D3D8]"
                      }`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/task"
                    className={({ isActive }) =>
                      `transition-colors duration-300 ${
                        isActive
                          ? "text-[#52D3D8]"
                          : "text-white hover:text-[#52D3D8]"
                      }`
                    }
                  >
                    Task Flow
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tracker"
                    className={({ isActive }) =>
                      `transition-colors duration-300 ${
                        isActive
                          ? "text-[#52D3D8]"
                          : "text-white hover:text-[#52D3D8]"
                      }`
                    }
                  >
                    Time Tracker
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/pomodoro"
                    className={({ isActive }) =>
                      `transition-colors duration-300 ${
                        isActive
                          ? "text-[#52D3D8]"
                          : "text-white hover:text-[#52D3D8]"
                      }`
                    }
                  >
                    Pomodoro
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/timer"
                    className={({ isActive }) =>
                      `transition-colors duration-300 ${
                        isActive
                          ? "text-[#52D3D8]"
                          : "text-white hover:text-[#52D3D8]"
                      }`
                    }
                  >
                    Timer
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* Profile/Settings Button */}
          {/* <div className="hidden md:block">
            <button className="bg-[#52D3D8] text-white px-4 py-2 rounded-lg hover:bg-[#52D3D8]/80 transition-colors duration-300">
              Log in
            </button>
          </div> */}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/80 backdrop-blur-sm">
          <a
            href="#"
            className="block px-3 py-2 text-white hover:text-[#52D3D8] transition-colors duration-300"
          >
            Task Flow
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-white hover:text-[#52D3D8] transition-colors duration-300"
          >
            Time Tracker
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-white hover:text-[#52D3D8] transition-colors duration-300"
          >
            Pomodoro
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-white hover:text-[#52D3D8] transition-colors duration-300"
          >
            Timer
          </a>
          {/* <button className="w-full mt-4 bg-[#52D3D8] text-white px-4 py-2 rounded-lg hover:bg-[#52D3D8]/80 transition-colors duration-300">
            Giriş Yap
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
