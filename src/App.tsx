import { useState, useEffect } from 'react';
import LevelSelector from './components/LevelSelector';
import Game from './components/Game';
import { LevelData, levels as fallbackLevels } from './data/levels';

export default function App() {
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
