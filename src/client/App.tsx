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
      <HomeScreen username={username} />
      <BoltBadge mode="white" />
    </>
  );
};