import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { logout } from "../actions/userAction";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.userLogin || {});

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    closeMenu();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Support", href: "/support" },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/your-linkedin-username",
      external: true,
    },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Cricket Clips</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-gray-700 font-medium items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            )}
            {!user && (
              <>
                <a href="/login" className="hover:text-blue-600 transition-colors">
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-2 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                onClick={closeMenu}
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 w-full text-left py-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={18} /> Logout
              </button>
            )}
            {!user && (
              <>
                <a
                  href="/login"
                  onClick={closeMenu}
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Login
                </a>
                <a
                  href="/register"
                  onClick={closeMenu}
                  className="block py-2 text-blue-600 font-medium"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}