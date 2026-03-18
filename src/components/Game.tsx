import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ArrowLeft, BookOpen, Sparkles, Dumbbell, Trophy } from 'lucide-react';
import { LevelData, PrefixData } from '../data/levels';
import ExerciseBlock from './ExerciseBlock';

interface GameProps {
  level: LevelData;
  onBack: () => void;
  onNextLevel: () => void;
  isLastLevel: boolean;
}

export default function Game({ level, onBack, onNextLevel, isLastLevel }: GameProps) {
  const [foundPrefixes, setFoundPrefixes] = useState<string[]>([]);
  const [activePrefix, setActivePrefix] = useState<PrefixData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Exercise state
  const [completedPrefixExercises, setCompletedPrefixExercises] = useState<string[]>([]);
  const [activeExercisePrefix, setActiveExercisePrefix] = useState<string | null>(null);
  const [showLevelExercises, setShowLevelExercises] = useState(false);
  const [levelExercisesCompleted, setLevelExercisesCompleted] = useState(false);

  const handlePrefixClick = (prefixData: PrefixData) => {
    if (foundPrefixes.includes(prefixData.prefix)) {
      setActivePrefix(prefixData);
      return;
    }

    setActivePrefix(prefixData);
    setShowSuccess(true);
    
    setTimeout(() => {
      setFoundPrefixes(prev => [...prev, prefixData.prefix]);
      setShowSuccess(false);
    }, 1500);
  };

  const handleCompletePrefixExercises = (prefix: string) => {
    setCompletedPrefixExercises(prev => [...prev, prefix]);
    setActiveExercisePrefix(null);
  };

  const handleCompleteLevelExercises = () => {
    setLevelExercisesCompleted(true);
    setShowLevelExercises(false);
  };

  const allPrefixesFound = foundPrefixes.length === level.prefixes.length;
  const allPrefixExercisesDone = completedPrefixExercises.length === level.prefixes.length;
  const canStartLevelExercises = allPrefixesFound && allPrefixExercisesDone;
  const isComplete = levelExercisesCompleted;

  // Find the active exercise data
  const activePrefixData = level.prefixes.find(p => p.prefix === activeExercisePrefix);

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Levels</span>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800">Level {level.id}</h1>
          <p className="text-sm text-slate-500 font-medium">{foundPrefixes.length} / {level.prefixes.length} words found</p>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-8">
        
        {/* Play Area */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-2">Base Verb</h2>
            <div className="text-5xl font-serif text-slate-800 mb-2">{level.baseVerb}</div>
            <div className="text-lg text-slate-500 italic">{level.baseMeaning}</div>
          </div>

          {/* Interaction Zone */}
          <div className="flex flex-col items-center w-full max-w-2xl">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {level.prefixes.map((p) => {
                const isFound = foundPrefixes.includes(p.prefix);
                const isActive = activePrefix?.prefix === p.prefix && !showSuccess;
                return (
                  <button
                    key={p.prefix}
                    onClick={() => handlePrefixClick(p)}
                    disabled={showSuccess && !isFound}
                    className={`
                      px-6 py-3 rounded-2xl text-xl font-medium transition-all duration-300
                      ${isFound 
                        ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200' 
                        : isActive
                          ? 'bg-indigo-600 text-white shadow-lg scale-105'
                          : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'
                      }
                    `}
                  >
                    {p.prefix}-
                  </button>
                );
              })}
            </div>

            {/* Result Display */}
            <div className="h-40 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {showSuccess && activePrefix && !foundPrefixes.includes(activePrefix.prefix) && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="flex items-center text-emerald-500 mb-2">
                      <Sparkles className="w-6 h-6 mr-2" />
                      <span className="font-bold uppercase tracking-wider text-sm">New Word Found!</span>
                    </div>
                    <div className="text-4xl font-serif text-slate-800 mb-2">
                      <span className="text-emerald-600">{activePrefix.prefix}</span>
                      {level.baseVerb}
                    </div>
                    <div className="text-xl text-slate-600">{activePrefix.resultMeaning}</div>
                  </motion.div>
                )}

                {activePrefix && (foundPrefixes.includes(activePrefix.prefix) || (!showSuccess && foundPrefixes.includes(activePrefix.prefix))) && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-center max-w-lg"
                  >
                    <div className="text-3xl font-serif text-slate-800 mb-1">
                      <span className="text-indigo-600">{activePrefix.prefix}</span>
                      {level.baseVerb}
                    </div>
                    <div className="text-lg font-medium text-slate-600 mb-4">{activePrefix.resultMeaning}</div>
                    <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 text-slate-700 italic">
                      "{activePrefix.example}"
                    </div>
                  </motion.div>
                )}

                {!activePrefix && !showSuccess && (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-400 text-lg flex items-center"
                  >
                    Select a prefix to combine with the verb
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active Exercise Block */}
        {activeExercisePrefix && activePrefixData && activePrefixData.exercises && (
          <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })}>
            <ExerciseBlock 
              exercises={activePrefixData.exercises} 
              onComplete={() => handleCompletePrefixExercises(activePrefixData.prefix)}
              title={`Practice: ${activePrefixData.prefix}${level.baseVerb}`}
            />
          </div>
        )}

        {/* Level Exercises Block */}
        {showLevelExercises && level.levelExercises && (
          <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })}>
            <ExerciseBlock 
              exercises={level.levelExercises} 
              onComplete={handleCompleteLevelExercises}
              title={`Final Test: Level ${level.id}`}
            />
          </div>
        )}

        {/* Found Words List */}
        {foundPrefixes.length > 0 && !showLevelExercises && !isComplete && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-indigo-500" />
              Dictionary ({foundPrefixes.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {level.prefixes
                .filter(p => foundPrefixes.includes(p.prefix))
                .map(p => {
                  const exercisesDone = completedPrefixExercises.includes(p.prefix);
                  const hasExercises = p.exercises && p.exercises.length > 0;
                  
                  return (
                    <div key={p.prefix} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="text-lg font-bold text-slate-800">
                          <span className="text-indigo-600">{p.prefix}</span>{level.baseVerb}
                        </div>
                        <div className="text-sm font-medium text-slate-500 bg-white px-2 py-1 rounded-md shadow-sm">
                          {p.meaning}
                        </div>
                      </div>
                      <div className="text-slate-600 mb-4">{p.resultMeaning}</div>
                      
                      {hasExercises && (
                        <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-500 flex items-center">
                            {exercisesDone ? (
                              <><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1" /> Mastered</>
                            ) : (
                              <><Dumbbell className="w-4 h-4 text-amber-500 mr-1" /> Needs Practice</>
                            )}
                          </span>
                          {!exercisesDone && (
                            <button
                              onClick={() => setActiveExercisePrefix(p.prefix)}
                              className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-200 transition-colors"
                            >
                              Practice
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Final Test Banner */}
        {canStartLevelExercises && !showLevelExercises && !isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white text-center shadow-lg"
          >
            <Trophy className="w-12 h-12 mx-auto mb-4 text-indigo-200" />
            <h3 className="text-2xl font-bold mb-2">Ready for the Final Test?</h3>
            <p className="text-indigo-100 mb-6">You've mastered all prefixes for this level. Complete the final test to unlock the next level.</p>
            <button
              onClick={() => setShowLevelExercises(true)}
              className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-sm"
            >
              Start Final Test
            </button>
          </motion.div>
        )}

        {/* Level Complete */}
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500 rounded-3xl p-8 text-white text-center shadow-xl"
          >
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-200" />
            <h2 className="text-3xl font-bold mb-2">Level Complete!</h2>
            <p className="text-emerald-100 mb-8 text-lg">You've mastered all prefixes and passed the final test for "{level.baseVerb}".</p>
            
            {!isLastLevel ? (
              <button 
                onClick={onNextLevel}
                className="bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors inline-flex items-center"
              >
                Next Level
                <ChevronRight className="w-6 h-6 ml-2" />
              </button>
            ) : (
              <button 
                onClick={onBack}
                className="bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors inline-flex items-center"
              >
                Back to Menu
              </button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}