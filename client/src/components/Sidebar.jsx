import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  LogOut, 
  User as UserIcon,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getLinks = () => {
    const baseLinks = [
      { name: 'Dashboard', path: '/', icon: Home },
      { name: 'Scholarships', path: '/scholarships', icon: BookOpen },
    ];

    if (!user) return baseLinks;

    if (user.role === 'student') {
      return [
        ...baseLinks,
        { name: 'My Applications', path: '/applications', icon: FileText },
        { name: 'Feedback', path: '/feedback', icon: MessageSquare },
      ];
    }

    if (user.role === 'collegeAdmin') {
      return [
        ...baseLinks,
        { name: 'Student Applications', path: '/applications', icon: FileText },
      ];
    }

    if (user.role === 'admin') {
      return [
        ...baseLinks,
        { name: 'Manage Applications', path: '/applications', icon: FileText },
        { name: 'All Feedback', path: '/feedback', icon: MessageSquare },
      ];
    }

    return baseLinks;
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-bg-card border-r border-primary-900/40 h-screen flex flex-col fixed left-0 top-0 text-gray-300">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          TakeChance
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path || 
                           (link.path !== '/' && location.pathname.startsWith(link.path));
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-900/60 text-white shadow-md shadow-primary-900/20 border border-primary-800' 
                  : 'hover:bg-primary-950/50 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary-400' : 'text-gray-400'} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-primary-900/40 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-800 flex flex-shrink-0 items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || <UserIcon size={16} />}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Guest'}</p>
            <p className="text-xs text-gray-400 truncate capitalize">{user?.role || ''}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 mt-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
