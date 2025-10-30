import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export function AppShell({ children, currentRoute, onNavigate }: AppShellProps) {

  const getPageTitle = () => {
    switch (currentRoute) {
      case 'library':
        return 'Song Library';
      case 'planner':
        return 'Service Planner';
      case 'settings':
        return 'Settings';
      default:
        return 'The Path';
    }
  };

  const handleStartPresentation = () => {
    // TODO: Implement in Stage 5
    console.log('Start presentation');
  };

  return (
    <div className="flex h-screen bg-brand-offWhite">
      {/* Sidebar */}
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          title={getPageTitle()}
          onStartPresentation={currentRoute !== 'settings' ? handleStartPresentation : undefined}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
