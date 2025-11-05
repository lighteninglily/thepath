import { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { LibraryPage } from './pages/LibraryPage';
import { PlannerPage } from './pages/PlannerPage';
import { SettingsPage } from './pages/SettingsPage';
import { AudienceViewPage } from './pages/AudienceViewPage';
import { LoadingScreen } from './components/LoadingScreen';
import { useImagePreloader } from './hooks/useImagePreloader';

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Check URL hash for initial route
    const hash = window.location.hash.replace('#/', '');
    // Audience route is for projection window only, not main app
    if (hash === 'audience') {
      return hash;
    }
    return hash || 'library';
  });

  // Preload ALL images for instant display (PowerPoint-style)
  const { loadedImages, totalImages, isReady, progress } = useImagePreloader();

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash) setCurrentRoute(hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show loading screen until all images are preloaded (PowerPoint-style)
  if (!isReady) {
    return <LoadingScreen progress={progress} loadedImages={loadedImages} totalImages={totalImages} />;
  }

  // Audience view is full-screen projection window
  // Presenter view is now embedded in ServiceEditorModal via PresenterPage component
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
