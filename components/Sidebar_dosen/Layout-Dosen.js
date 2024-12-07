import React from "react";
import { SidebarDosen } from "./Sidebar-Dosen";
export const LayoutDosen = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-grow justify-start">
      <SidebarDosen/>
      <div className="flex-1 flex-col bg-gradient-to-br from-[#FFD659] to-[#FFFFFF] p-4 text-white">
        {children}
      </div>
    </div>
  );
};