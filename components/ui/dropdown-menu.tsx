import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "react-icons/fi"; // Replace with your icon library

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child, { toggleDropdown });
          }
          if (child.type === DropdownMenuContent) {
            return isOpen ? child : null;
          }
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({ asChild, children, toggleDropdown }) {
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (e) => {
      e.stopPropagation();
      child.props.onClick?.(e);
      toggleDropdown();
    },
  });
}

export function DropdownMenuContent({ align = "start", children }) {
  return (
    <div
      className={`absolute mt-2 bg-white border rounded shadow-lg z-50 ${
        align === "end" ? "right-0" : "left-0"
      }`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <div
      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
