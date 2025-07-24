
import React from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 bg-gray-900 min-h-screen">
        <div className="min-h-screen bg-gray-900">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
