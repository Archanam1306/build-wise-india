import React from 'react';
import { Input } from '@/components/ui/input';
import { Bell, Languages } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-white flex items-center px-4 py-2 border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center mr-4">
        <img
          src="/logo.png"
          alt="Site Sync Logo"
          className="h-10 w-10 rounded"
        />
      </div>
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <Input
          type="text"
          placeholder="Search"
          className="bg-gray-100 border-none rounded-full px-4 py-2 text-gray-700"
        />
      </div>
      {/* Right Side Icons */}
      <div className="flex items-center gap-8 ml-6">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-black" />
          <span className="text-black text-sm">Notifications</span>
        </div>
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-black" />
          <span className="text-black text-sm">Language</span>
        </div>
        {/* Profile Avatar */}
        <div className="flex items-center">
          <img
            src={'/default-avatar.jpg'}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
