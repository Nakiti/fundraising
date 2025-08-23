"use client"

import { createContext, useContext, useState } from 'react';

const DonorSidebarContext = createContext();

export const useDonorSidebar = () => {
  const context = useContext(DonorSidebarContext);
  if (!context) {
    throw new Error('useDonorSidebar must be used within a DonorSidebarProvider');
  }
  return context;
};

export const DonorSidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const value = {
    isCollapsed,
    toggleSidebar,
  };

  return (
    <DonorSidebarContext.Provider value={value}>
      {children}
    </DonorSidebarContext.Provider>
  );
};
