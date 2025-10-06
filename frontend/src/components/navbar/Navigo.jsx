import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut ,CircleUserRound} from "lucide-react";
import { useAuthStore } from "../../store/authUser";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `transition-colors duration-300 ${
      isActive ? "text-[#52D3D8]" : "text-white hover:text-[#52D3D8]"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleProfile = () =>{
    navigate("/profile")
  }

  const closeMobile = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-around h-16">
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="ml-10 flex items-center space-x-12">
              <li>
                <NavLink to="/" end className={linkClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/task" className={linkClass}>
                  Task Flow
                </NavLink>
              </li>
              <li>
                <NavLink to="/tracker" className={linkClass}>
                  Time Tracker
                </NavLink>
              </li>
              <li>
                <NavLink to="/pomodoro" className={linkClass}>
                  Pomodoro
                </NavLink>
              </li>
              <li>
                <NavLink to="/timer" className={linkClass}>
                  Timer
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Profile / Login-Logout */}
          <div className="hidden md:block">
            {!user ? (
        <NavLink
          to="/login"
          className="text-white px-4 py-2 rounded-lg hover:text-[#52D3D8] hover:underline transition-colors duration-300"
        >
          Login
        </NavLink>
      ) : (
        <div className="flex items-center justify-around gap-3">
          <div
            className="relative group cursor-pointer"
            onClick={handleProfile}
          >
            <CircleUserRound className="w-6 h-6 text-white hover:text-[#52D3D8] transition-colors duration-300" />
            <span
              className="absolute left-1/2 -translate-x-1/2 top-8
                bg-gray-900 text-white text-xs rounded-md px-2 py-1
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
            >
              Profile
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-white px-4 py-2 rounded-lg hover:text-[#52D3D8] transition-colors duration-300"
          >
            <span className="inline-flex items-center gap-2 cursor-pointer">
              Logout <LogOut className="w-4 h-4" />
            </span>
          </button>
        </div>
      )} 
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/80 backdrop-blur-sm">
        <NavLink to="/" onClick={closeMobile} className="block px-3 py-2 text-white hover:text-[#52D3D8] transition-colors duration-300">
              Home
          </NavLink>
          <NavLink to="/task" onClick={closeMobile} className="block px-3 py-2 text-white hover:text-[#52D3D8] transition-colors duration-300">
            Task Flow
          </NavLink>
          <NavLink to="/tracker" onClick={closeMobile} className="block px-3 py-2 text-white hover:text-[#52D3D8] transition-colors duration-300">
            Time Tracker
          </NavLink>
          <NavLink to="/pomodoro" onClick={closeMobile} className="block px-3 py-2 text-white hover:text-[#52D3D8] transition-colors duration-300">
            Pomodoro
          </NavLink>
          <NavLink to="/timer" onClick={closeMobile} className="block px-3 py-2 text-white hover:text-[#52D3D8] transition-colors duration-300">
            Timer
          </NavLink>

          {!user ? (
            <NavLink
              to="/login"
              onClick={closeMobile}
              className="w-full mt-4 block text-center bg-[#52D3D8] text-white px-4 py-2 rounded-lg hover:bg-[#52D3D8]/80 transition-colors duration-300"
            >
              Login
            </NavLink>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                closeMobile();
              }}
              className="w-full mt-4 bg-[#52D3D8] text-white px-4 py-2 rounded-lg hover:bg-[#52D3D8]/80 transition-colors duration-300"
            >
              <span className="inline-flex items-center gap-2">
                Logout <LogOut className="w-4 h-4" />
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
