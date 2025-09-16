import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex min-h-[calc(100vh-80px)] p-4">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 w-full pt-4"> {/* Added top padding */}
          <div className="bg-gray-50 rounded-2xl p-6 min-h-[calc(100vh-100px)]"> {/* Adjusted min-height */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

