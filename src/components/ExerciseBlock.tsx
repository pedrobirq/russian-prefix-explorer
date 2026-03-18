import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { ExerciseData } from '../data/levels';

interface ExerciseBlockProps {
  exercises: ExerciseData[];
  onComplete: () => void;
  title: string;
}

export default function ExerciseBlock({ exercises, onComplete, title }: ExerciseBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!exercises || exercises.length === 0) {
    return null;
  }

  const currentExercise = exercises[currentIndex];

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    
    setSelectedOption(option);
    setIsCorrect(option === currentExercise.correctAnswer);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      onComplete();
    }
  };

  // Split sentence by placeholder "___"
  const parts = currentExercise.sentence.split('___');

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {currentIndex + 1} / {exercises.length}
        </div>
      </div>

      <div className="mb-8">
        <div className="text-2xl text-slate-700 leading-relaxed font-serif">
          {parts[0]}
          <span className={`
            inline-block min-w-[120px] border-b-2 mx-2 text-center pb-1 font-bold
            ${selectedOption 
              ? isCorrect 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-red-500 text-red-600'
              : 'border-slate-300 text-transparent'
            }
          `}>
            {selectedOption || '___'}
          </span>
          {parts[1]}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {currentExercise.options.map((option, idx) => {
          let buttonClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600";
          
          if (selectedOption !== null) {
            if (option === currentExercise.correctAnswer) {
              buttonClass = "bg-emerald-50 border-2 border-emerald-500 text-emerald-700";
            } else if (option === selectedOption && !isCorrect) {
              buttonClass = "bg-red-50 border-2 border-red-500 text-red-700";
            } else {
              buttonClass = "bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              disabled={selectedOption !== null}
              className={`px-6 py-4 rounded-2xl text-lg font-medium transition-all duration-300 ${buttonClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between pt-6 border-t border-slate-100"
          >
            <div className="flex items-center">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" />
                  <span className="text-emerald-600 font-bold">Правильно! (Correct!)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                  <span className="text-red-600 font-bold">Неправильно. (Incorrect.)</span>
                </>
              )}
            </div>
            <button
              onClick={handleNext}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              {currentIndex < exercises.length - 1 ? 'Next' : 'Finish'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}