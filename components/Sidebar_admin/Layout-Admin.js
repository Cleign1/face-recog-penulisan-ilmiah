import React from "react";
import { SidebarAdmin } from "./Sidebar-Admin";

export const LayoutAdmin = ({ children }) => {
  return (
    <div className="h-screen flex flex-grow justify-start">
      <SidebarAdmin/>
      <div className="bg-gradient-to-br from-rose-100 to-sky-200 flex-1 p-4 text-white">
        {children}
      </div>
    </div>
  );
};