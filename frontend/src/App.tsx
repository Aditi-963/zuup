import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Overview } from './components/Overview';
import { Dashboard } from './components/Dashboard';
import { EmergencyChat } from './components/EmergencyChat';
import { WhyWeWin } from './components/WhyWeWin';

function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [triggerAction, setTriggerAction] = useState<string | undefined>(undefined);

  const handleNavigate = (view: string, action?: string) => {
    setCurrentView(view);
    setTriggerAction(action);
  };

  return (
    <div>
      <Navbar currentView={currentView} onViewChange={(view) => handleNavigate(view)} />
      
      {currentView === 'home' && <Overview onNavigate={handleNavigate} />}
      {currentView === 'dashboard' && (
        <Dashboard 
          triggerAction={triggerAction} 
          onClearAction={() => setTriggerAction(undefined)} 
        />
      )}
      {currentView === 'emergency' && <EmergencyChat />}
      {currentView === 'why' && <WhyWeWin onNavigate={(view) => handleNavigate(view)} />}
    </div>
  );
}

export default App;
