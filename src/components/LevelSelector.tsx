import { motion } from 'motion/react';
import { BookA, Play } from 'lucide-react';
import { LevelData } from '../data/levels';

interface LevelSelectorProps {
  levels: LevelData[];
  onSelectLevel: (levelId: number) => void;
  completedLevels: number[];
}

export default function LevelSelector({ levels, onSelectLevel, completedLevels }: LevelSelectorProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-slate-900 font-sans flex flex-col items-center py-12 px-6">
      <div className="max-w-3xl w-full">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 text-white mb-6 shadow-xl transform -rotate-6">
            <BookA className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
            Russian Prefixes
          </h1>
          <p className="text-xl text-slate-600 max-w-xl mx-auto">
            Master the art of Russian verbs by combining them with prefixes to unlock new meanings.
          </p>
        </header>

        <div className="space-y-6">
          {levels.map((level, index) => {
            const isCompleted = completedLevels.includes(level.id);
            const isLocked = index > 0 && !completedLevels.includes(levels[index - 1].id);

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => !isLocked && onSelectLevel(level.id)}
                  disabled={isLocked}
                  className={`
                    w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 flex items-center justify-between
                    ${isLocked 
                      ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed' 
                      : isCompleted
                        ? 'bg-white border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-md'
                        : 'bg-white border-indigo-100 hover:border-indigo-400 shadow-sm hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold mr-6
                      ${isLocked ? 'bg-slate-200 text-slate-400' : isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}
                    `}>
                      {level.id}
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-slate-800 mb-1">
                        {level.baseVerb}
                      </h3>
                      <p className="text-slate-500 font-medium">
                        {level.baseMeaning} • {level.prefixes.length} prefixes
                      </p>
                    </div>
                  </div>
                  
                  {!isLocked && (
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'}
                    `}>
                      <Play className="w-5 h-5 ml-1" />
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
