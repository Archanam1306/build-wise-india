
import React from 'react';
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
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'contractor':
        return [
          { icon: Home, label: 'Dashboard', path: '/contractor' },
          { icon: FolderOpen, label: 'Projects', path: '/contractor/projects' },
          { icon: Plus, label: 'Create Project', path: '/contractor/create-project' },
          { icon: Camera, label: 'Daily Updates', path: '/contractor/daily-updates' },
          { icon: CreditCard, label: 'Payments', path: '/contractor/payments' },
          { icon: FileImage, label: 'Blueprints', path: '/contractor/blueprints' },
          { icon: BarChart3, label: 'Gantt Chart', path: '/contractor/gantt' },
          { icon: Package, label: 'Materials', path: '/contractor/materials' },
          { icon: Palette, label: 'Paint Picker', path: '/contractor/paint-picker' },
          { icon: Users, label: 'Contacts', path: '/contractor/contacts' },
          { icon: Wrench, label: 'Maintenance Requests', path: '/contractor/maintenance-requests' },
        ];
      case 'site-manager':
        return [
          { icon: Home, label: 'Dashboard', path: '/site-manager' },
          { icon: Camera, label: 'Daily Updates', path: '/site-manager/daily-updates' },
          { icon: CreditCard, label: 'Payments', path: '/site-manager/payments' },
          { icon: Package, label: 'Materials', path: '/site-manager/materials' },
          { icon: FileImage, label: 'Blueprints', path: '/site-manager/blueprints' },
          { icon: BarChart3, label: 'Gantt Chart', path: '/site-manager/gantt' },
          { icon: Users, label: 'Contacts', path: '/site-manager/contacts' },
          { icon: Wrench, label: 'Maintenance Requests', path: '/site-manager/maintenance-requests' },
        ];
      case 'customer':
        return [
          { icon: Home, label: 'Dashboard', path: '/customer' },
          { icon: FolderOpen, label: 'Projects', path: '/customer/projects' },
          { icon: Camera, label: 'Daily Updates', path: '/customer/daily-updates' },
          { icon: CreditCard, label: 'Payments', path: '/customer/payments' },
          { icon: FileImage, label: 'Blueprints', path: '/customer/blueprints' },
          { icon: BarChart3, label: 'Gantt Chart', path: '/customer/gantt' },
          { icon: Package, label: 'Materials', path: '/customer/materials' },
          { icon: Users, label: 'Contacts', path: '/customer/contacts' },
          { icon: Wrench, label: 'Maintenance Requests', path: '/customer/maintenance-requests' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const location = useLocation();

  return (
    <div className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-700 min-h-screen flex flex-col">
      <div className="p-4 bg-gray-900">
        <Link to="/" className="flex items-center text-white font-semibold text-lg">
          Construction App
        </Link>
      </div>
      <nav className="flex-1 p-4 bg-gray-900">
        <ul>
          {menuItems.map((item) => (
            <li key={item.label} className="mb-2">
              <Link
                to={item.path}
                className={cn(
                  'flex items-center p-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors',
                  location.pathname === item.path && 'bg-gray-800 text-white'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 bg-gray-900">
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
