import { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { LibraryPage } from './pages/LibraryPage';
import { PlannerPage } from './pages/PlannerPage';
import { SettingsPage } from './pages/SettingsPage';
import { AudienceViewPage } from './pages/AudienceViewPage';

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Check URL hash for initial route
    const hash = window.location.hash.replace('#/', '');
    // Audience route is for separate window only, not main app
    if (hash === 'audience') {
      return 'audience';
    }
    return hash || 'library';
  });

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash) setCurrentRoute(hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Audience view is full-screen, separate window only
  if (currentRoute === 'audience') {
    return <AudienceViewPage />;
  }

  const renderPage = () => {
    switch (currentRoute) {
      case 'library':
        return <LibraryPage />;
      case 'planner':
        return <PlannerPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LibraryPage />;
    }
  };

  return (
    <AppShell currentRoute={currentRoute} onNavigate={setCurrentRoute}>
      {renderPage()}
    </AppShell>
  );
}

export default App;
