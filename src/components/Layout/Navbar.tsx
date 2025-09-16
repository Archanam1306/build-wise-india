import React from 'react';
import { Input } from '@/components/ui/input';
import { Bell, Languages, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-white flex items-center justify-between px-6 py-1 border-b border-gray-200">
      {/* Left side with logo and search */}
      <div className="flex items-center flex-1">
        <div className="flex items-center mr-8">
          <img
            src="/logo.png"
            alt="Site Sync Logo"
            className="h-10 w-10 rounded"
          />
        </div>
        <div className="max-w-lg w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            className="bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 text-gray-700"
          />
        </div>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <button className="hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-gray-700 text-xs block">Notifications</span>
        </div>
        
        <div className="text-center">
          <button className="hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <Languages className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-gray-700 text-xs block">Language</span>
        </div>

        
        
        <button className="flex items-center">
          <img
            src={'/default-avatar.jpg'}
            alt="Profile"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
