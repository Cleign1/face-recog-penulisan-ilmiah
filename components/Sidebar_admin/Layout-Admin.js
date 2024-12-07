import React from "react";
import { SidebarAdmin } from "./Sidebar-Admin";

export const LayoutAdmin = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <SidebarAdmin/>
      <div className="flex flex-1 bg-gradient-to-br from-[#FFD659] to-[#FFFFFF] p-4 text-white">
        <div className="w-full">{children}
        </div>
      </div>
    </div>
  );
};