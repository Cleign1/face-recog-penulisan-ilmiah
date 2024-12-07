import React from "react";
import { Sidebar } from "./Sidebar";

export const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-grow justify-start">
      <Sidebar/>
      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#FFD659] to-[#FFFFFF] p-4 text-white">
        {children}
      </div>
    </div>
  );
};
