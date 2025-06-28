import { BoltBadge } from './BoltBadge';

export const App = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            BrokenCalc
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Coming Soon...
          </p>
        </div>
      </div>
      <BoltBadge mode="white" />
    </>
  );
};