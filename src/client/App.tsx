import { useEffect, useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { BoltBadge } from './BoltBadge';

export const App = () => {
  const [username, setUsername] = useState<string | undefined>();

  // Simulate Reddit username integration
  useEffect(() => {
    // In a real Devvit app, this would come from Reddit context
    // For now, we'll simulate with a placeholder
    const simulatedUsername = 'YaminoForTheWin';
    setUsername(simulatedUsername);
  }, []);

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 flex items-center justify-center py-4 px-2 overflow-hidden">
        <HomeScreen username={username} />
      </div>
      <BoltBadge mode="white" />
    </>
  );
};