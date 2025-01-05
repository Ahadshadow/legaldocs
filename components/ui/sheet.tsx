// "@/components/ui/sheet"
import React, { useState } from "react";

export function Sheet({ open, onOpenChange, children }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => onOpenChange(false)}>
          <div className="relative">{children}</div>
        </div>
      )}
    </>
  );
}

export function SheetTrigger({ asChild, children }) {
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (e) => {
      e.stopPropagation();
      child.props.onClick?.(e);
    },
  });
}

export function SheetContent({ side = "left", children, className }) {
  return (
    <div className={`fixed z-50 bg-white shadow-lg ${side === "left" ? "left-0" : "right-0"} ${className}`}>
      {children}
    </div>
  );
}
