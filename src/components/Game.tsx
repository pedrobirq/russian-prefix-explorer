import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ArrowLeft, BookOpen, Sparkles, Dumbbell, Trophy, Plus, XCircle } from 'lucide-react';
import { LevelData, PrefixData } from '../data/levels';
import ExerciseBlock from './ExerciseBlock';

interface GameProps {
  level: LevelData;
  onBack: () => void;
  onNextLevel: () => void;
  isLastLevel: boolean;
  token: string;
}

export default function Game({ level, onBack, onNextLevel, isLastLevel, token }: GameProps) {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [activeWord, setActiveWord] = useState<PrefixData | null>(null);
  const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);
  const [selectedBaseForm, setSelectedBaseForm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  
  // Exercise state
  const [completedWordExercises, setCompletedWordExercises] = useState<string[]>([]);
  const [activeExerciseWord, setActiveExerciseWord] = useState<string | null>(null);
  const [showLevelExercises, setShowLevelExercises] = useState(false);
  const [levelExercisesCompleted, setLevelExercisesCompleted] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoadingProgress(true);
      try {
        const res = await fetch('/api/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const levelProgress = data.find((p: any) => p.level_id === level.id);
          if (levelProgress) {
            setFoundWords(levelProgress.found_words || []);
            setCompletedWordExercises(levelProgress.completed_word_exercises || []);
            setLevelExercisesCompleted(levelProgress.level_completed || false);
          } else {
            // Reset if no progress for this level
            setFoundWords([]);
            setCompletedWordExercises([]);
            setLevelExercisesCompleted(false);
          }
        }
      } catch (e) {
        console.error('Failed to load progress', e);
      } finally {
        setIsLoadingProgress(false);
      }
    };
    fetchProgress();
  }, [level.id, token]);

  const saveProgress = async (newFoundWords: string[], newCompletedExercises: string[], newLevelCompleted: boolean) => {
    if (isLoadingProgress) return;
    try {
      await fetch(`/api/progress/${level.id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          foundWords: newFoundWords,
          completedWordExercises: newCompletedExercises,
          levelCompleted: newLevelCompleted
        })
      });
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  useEffect(() => {
    if (!isLoadingProgress) {
      saveProgress(foundWords, completedWordExercises, levelExercisesCompleted);
    }
  }, [foundWords, completedWordExercises, levelExercisesCompleted, isLoadingProgress]);

  const uniquePrefixes = Array.from(new Set(level.prefixes.map(p => p.prefix)));
  const uniqueBaseForms = Array.from(new Set(level.prefixes.map(p => p.baseForm)));

  const handlePrefixSelect = (prefix: string) => {
    if (showSuccess || showError) return;
    setSelectedPrefix(prefix);
    if (selectedBaseForm) {
      checkCombination(prefix, selectedBaseForm);
    }
  };

  const handleBaseFormSelect = (form: string) => {
    if (showSuccess || showError) return;
    setSelectedBaseForm(form);
    if (selectedPrefix) {
      checkCombination(selectedPrefix, form);
    }
  };

  const checkCombination = (prefix: string, baseForm: string) => {
    const matchedWord = level.prefixes.find(
      p => p.prefix === prefix && p.baseForm === baseForm
    );
    
    if (matchedWord) {
      setActiveWord(matchedWord);
      if (!foundWords.includes(matchedWord.resultWord)) {
        setShowSuccess(true);
        setTimeout(() => {
          setFoundWords(prev => [...prev, matchedWord.resultWord]);
          setShowSuccess(false);
          setSelectedPrefix(null);
          setSelectedBaseForm(null);
        }, 2000);
      } else {
        setTimeout(() => {
          setSelectedPrefix(null);
          setSelectedBaseForm(null);
        }, 1000);
      }
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setSelectedPrefix(null);
        setSelectedBaseForm(null);
      }, 1000);
    }
  };

  const handleCompletePrefixExercises = (resultWord: string) => {
    setCompletedWordExercises(prev => [...prev, resultWord]);
    setActiveExerciseWord(null);
  };

  const handleCompleteLevelExercises = () => {
    setLevelExercisesCompleted(true);
    setShowLevelExercises(false);
  };

  const allPrefixesFound = foundWords.length === level.prefixes.length;
  const allPrefixExercisesDone = completedWordExercises.length === level.prefixes.length;
  const canStartLevelExercises = allPrefixesFound && allPrefixExercisesDone;
  const isComplete = levelExercisesCompleted;

  // Find the active exercise data
  const activePrefixData = level.prefixes.find(p => p.resultWord === activeExerciseWord);

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
          <p className="text-sm text-slate-500 font-medium">{foundWords.length} / {level.prefixes.length} words found</p>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-8">
        
        {/* Play Area */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-2">Base Concept</h2>
            <div className="text-5xl font-serif text-slate-800 mb-2">{level.baseVerb}</div>
            <div className="text-lg text-slate-500 italic">{level.baseMeaning}</div>
          </div>

          {/* Interaction Zone */}
          <div className="flex flex-col items-center w-full max-w-2xl gap-6">
            <div className="w-full">
              <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-3 text-center">1. Select Prefix</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {uniquePrefixes.map((prefix) => {
                  const isSelected = selectedPrefix === prefix;
                  return (
                    <button
                      key={prefix}
                      onClick={() => handlePrefixSelect(prefix)}
                      disabled={showSuccess || showError}
                      className={`
                        px-6 py-3 rounded-2xl text-xl font-medium transition-all duration-300
                        ${isSelected 
                          ? 'bg-indigo-600 text-white shadow-md scale-105' 
                          : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'}
                      `}
                    >
                      {prefix}-
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center text-slate-300">
              <Plus className="w-8 h-8" />
            </div>

            <div className="w-full mb-8">
              <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-3 text-center">2. Select Base Form</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {uniqueBaseForms.map((form) => {
                  const isSelected = selectedBaseForm === form;
                  return (
                    <button
                      key={form}
                      onClick={() => handleBaseFormSelect(form)}
                      disabled={showSuccess || showError}
                      className={`
                        px-6 py-3 rounded-2xl text-xl font-medium transition-all duration-300
                        ${isSelected 
                          ? 'bg-indigo-600 text-white shadow-md scale-105' 
                          : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'}
                      `}
                    >
                      {form}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Result Display */}
            <div className="h-40 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {showError && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: [-10, 10, -10, 10, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="flex items-center text-rose-500 mb-2">
                      <XCircle className="w-6 h-6 mr-2" />
                      <span className="font-bold uppercase tracking-wider text-sm">Invalid Combination</span>
                    </div>
                  </motion.div>
                )}

                {showSuccess && activeWord && !foundWords.includes(activeWord.resultWord) && (
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
                      <span className="text-emerald-600">{activeWord.prefix}</span>
                      {activeWord.baseForm}
                    </div>
                    <div className="text-xl text-slate-600">{activeWord.resultMeaning}</div>
                  </motion.div>
                )}

                {activeWord && (foundWords.includes(activeWord.resultWord) || (!showSuccess && foundWords.includes(activeWord.resultWord))) && !showError && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-center max-w-lg"
                  >
                    <div className="text-3xl font-serif text-slate-800 mb-1">
                      <span className="text-indigo-600">{activeWord.prefix}</span>
                      {activeWord.baseForm}
                    </div>
                    <div className="text-lg font-medium text-slate-600 mb-4">{activeWord.resultMeaning}</div>
                    <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 text-slate-700 italic">
                      "{activeWord.example}"
                    </div>
                  </motion.div>
                )}

                {!activeWord && !showSuccess && !showError && (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-400 text-lg flex items-center"
                  >
                    Select a prefix and a base form to combine
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active Exercise Block */}
        {activeExerciseWord && activePrefixData && activePrefixData.exercises && (
          <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })}>
            <ExerciseBlock 
              exercises={activePrefixData.exercises} 
              onComplete={() => handleCompletePrefixExercises(activePrefixData.resultWord)}
              title={`Practice: ${activePrefixData.resultWord}`}
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
        {foundWords.length > 0 && !showLevelExercises && !isComplete && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-indigo-500" />
              Dictionary ({foundWords.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {level.prefixes
                .filter(p => foundWords.includes(p.resultWord))
                .map(p => {
                  const exercisesDone = completedWordExercises.includes(p.resultWord);
                  const hasExercises = p.exercises && p.exercises.length > 0;
                  
                  return (
                    <div key={p.resultWord} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="text-lg font-bold text-slate-800">
                          <span className="text-indigo-600">{p.prefix}</span>{p.baseForm}
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
                              onClick={() => setActiveExerciseWord(p.resultWord)}
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
