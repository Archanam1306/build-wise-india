import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  FileImage, 
  Package, 
  CreditCard, 
  Camera, 
  BarChart3, 
  FolderOpen, 
  Plus, 
  Palette, 
  LogOut,
  Wrench,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  icon?: React.ComponentType<any>;
  label?: string;
  path?: string;
  divider?: boolean;
  action?: React.MouseEventHandler<HTMLButtonElement>;
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'contractor':
        return {
          main: [
            { icon: Home, label: 'Dashboard', path: '/contractor' },
            { icon: Plus, label: 'Create Project', path: '/contractor/create-project' },
            { icon: Camera, label: 'Daily Updates', path: '/contractor/daily-updates' },
            { icon: CreditCard, label: 'Payments', path: '/contractor/payments' },
            { icon: BarChart3, label: 'Gantt Chart', path: '/contractor/gantt' },
            { icon: Package, label: 'Materials', path: '/contractor/materials' },
             { icon: Palette, label: 'Paint Picker', path: '/contractor/paint-picker' },
              { icon: Wrench, label: 'Maintenance Requests', path: '/contractor/maintenance-requests' },
          ],
          more: [
            { icon: FileImage, label: 'Blueprints', path: '/contractor/blueprints' },
            { icon: Users, label: 'Contacts', path: '/contractor/contacts' },
            { divider: true },
            { icon: LogOut, label: 'Logout', path: 'logout', action: handleLogout }
          ]
        };
      case 'site-manager':
        return {
          main: [
            { icon: Home, label: 'Dashboard', path: '/site-manager' },
            { icon: Camera, label: 'Daily Updates', path: '/site-manager/daily-updates' },
            { icon: CreditCard, label: 'Payments', path: '/site-manager/payments' },
            { icon: Package, label: 'Materials', path: '/site-manager/materials' },
            { icon: FileImage, label: 'Blueprints', path: '/site-manager/blueprints' },
            { icon: BarChart3, label: 'Gantt Chart', path: '/site-manager/gantt' },
            { icon: Users, label: 'Contacts', path: '/site-manager/contacts' },
            { icon: Wrench, label: 'Maintenance Requests', path: '/site-manager/maintenance-requests' },
          ],
          more: []
        };
      case 'customer':
        return {
          main: [
            { icon: Home, label: 'Dashboard', path: '/customer' },
            { icon: FolderOpen, label: 'Projects', path: '/customer/projects' },
            { icon: Camera, label: 'Daily Updates', path: '/customer/daily-updates' },
            { icon: CreditCard, label: 'Payments', path: '/customer/payments' },
            { icon: FileImage, label: 'Blueprints', path: '/customer/blueprints' },
            { icon: BarChart3, label: 'Gantt Chart', path: '/customer/gantt' },
            { icon: Package, label: 'Materials', path: '/customer/materials' },
            { icon: Users, label: 'Contacts', path: '/customer/contacts' },
            { icon: Wrench, label: 'Maintenance Requests', path: '/customer/maintenance-requests' },
          ],
          more: []
        };
      default:
        return {
          main: [],
          more: []
        };
    }
  };

  const menuItems = getMenuItems();
  const location = useLocation();

  const renderMenuItem = (item: MenuItem) => {
    if ('divider' in item) {
      return <div key="divider" className="my-2 border-t border-gray-100" />;
    }
    
    if ('action' in item) {
      return (
        <li key={item.label} className="list-none">
          <button
            onClick={item.action}
            className="flex items-center w-full p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors gap-3 text-sm font-medium"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        </li>
      );
    }

    return (
      <li key={item.label} className="list-none">
        <Link
          to={item.path}
          className={cn(
            'flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors gap-3 text-sm font-medium',
            location.pathname === item.path && 'bg-gradient-to-r from-[#1a472a] to-[#2d8659] text-white font-medium shadow-sm'
          )}
        >
          <item.icon className={cn(
            "h-5 w-5",
            location.pathname === item.path && 'text-white'
          )} />
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <div className="w-70 flex-shrink-0 p-4 min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl h-full p-4 shadow-sm flex flex-col">
        <div className="p-4">
          <Link to="/" className="flex items-center text-gray-900 font-semibold text-lg mb-6">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
            BuildWise
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-3 flex flex-col">
          {user?.role === 'contractor' ? (
            <>
              <div className="space-y-1">
                {menuItems.main.map(renderMenuItem)}
              </div>

              <div className="mt-auto pt-12">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center w-full p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors gap-3 text-sm font-medium"
                >
                  <MoreHorizontal className="h-5 w-5" />
                  More
                  
                </button>
                {showMore && (
                  <div className="pl-2 mt-2 space-y-1">
                    {menuItems.more.map(renderMenuItem)}
                  </div>
                )}
              </div>
            </>
          ) : (
            menuItems.main.map(renderMenuItem)
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
