import { Music, Calendar, Settings } from 'lucide-react';
import logo from '../../assets/logo.png';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

const navigationItems = [
  { id: 'library', label: 'Library', icon: Music },
  { id: 'planner', label: 'Planner', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentRoute, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-brand-skyBlue border-r border-brand-periwinkle flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-brand-periwinkle flex flex-col items-center">
        <img 
          src={logo} 
          alt="The Path Logo" 
          className="w-32 h-auto mb-2"
        />
        <p className="text-sm text-brand-offWhite/80 mt-1">Church Presentations</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-white text-brand-skyBlue shadow-md'
                        : 'text-white hover:bg-brand-powderBlue/30'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-brand-periwinkle">
        <p className="text-xs text-white/60 text-center">
          The Path v1.0.0
        </p>
      </div>
    </aside>
  );
}
