import { useState, useEffect } from 'react';
import LevelSelector from './components/LevelSelector';
import Game from './components/Game';
import Auth from './components/Auth';
import { LevelData, levels as fallbackLevels } from './data/levels';
import { LogOut } from 'lucide-react';

export default function App() {
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Auth state
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('/api/levels');
        if (!response.ok) {
          throw new Error('Failed to fetch levels');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setLevels(data);
      } catch (err: any) {
        console.error('Error fetching levels:', err);
        setError('Could not connect to the database. Using fallback data.');
        setLevels(fallbackLevels);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const fetchProgress = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const completed = data.filter((p: any) => p.level_completed).map((p: any) => p.level_id);
        setCompletedLevels(completed);
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
      }
    } catch (e) {
      console.error('Failed to fetch progress:', e);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [token, currentLevelId]); // Re-fetch progress when returning to level selector

  const handleLogin = (newToken: string, newUsername: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setCurrentLevelId(null);
    setCompletedLevels([]);
  };

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
  };

  const handleBack = () => {
    setCurrentLevelId(null);
  };

  const handleNextLevel = () => {
    if (currentLevelId) {
      if (!completedLevels.includes(currentLevelId)) {
        setCompletedLevels([...completedLevels, currentLevelId]);
      }
      
      const currentIndex = levels.findIndex(l => l.id === currentLevelId);
      if (currentIndex < levels.length - 1) {
        setCurrentLevelId(levels[currentIndex + 1].id);
      } else {
        setCurrentLevelId(null);
      }
    }
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="text-xl text-slate-600 font-medium">Loading levels...</div>
      </div>
    );
  }

  const currentLevel = levels.find(l => l.id === currentLevelId);
  const isLastLevel = levels.length > 0 && currentLevelId === levels[levels.length - 1].id;

  return (
    <>
      <div className="bg-slate-800 text-white px-6 py-2 flex justify-between items-center text-sm shadow-sm z-50 relative">
        <div className="font-medium text-slate-300">
          Logged in as <span className="font-bold text-white">{username}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center text-slate-300 hover:text-white transition-colors py-1 px-3 rounded-md hover:bg-slate-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-amber-100 text-amber-800 px-4 py-2 text-center text-sm font-medium border-b border-amber-200">
          {error} Please configure DATABASE_URL in the environment.
        </div>
      )}
      
      {currentLevel ? (
        <Game 
          level={currentLevel} 
          onBack={handleBack} 
          onNextLevel={handleNextLevel}
          isLastLevel={isLastLevel}
          token={token}
        />
      ) : (
        <LevelSelector 
          levels={levels}
          onSelectLevel={handleSelectLevel} 
          completedLevels={completedLevels} 
        />
      )}
    </>
  );
}
