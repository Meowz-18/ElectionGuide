/**
 * @file Quiz page component.
 * An interactive civic knowledge quiz that tests users on election
 * procedures and provides educational explanations for each answer.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RefreshCcw, Award, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS } from '../constants';

/**
 * Election Intelligence Quiz page.
 * @returns {React.ReactElement} The rendered quiz interface.
 */
const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  /** Memoize the current question data. */
  const question = useMemo(() => QUIZ_QUESTIONS[currentQuestion], [currentQuestion]);

  /** Memoize the percentage score for the results screen. */
  const percentageScore = useMemo(
    () => Math.round((score / QUIZ_QUESTIONS.length) * 100),
    [score],
  );

  const handleOptionClick = useCallback(
    (idx) => {
      if (isAnswered) return;
      setSelectedOption(idx);
      setIsAnswered(true);
      if (idx === question.answer) {
        setScore((prev) => prev + 1);
      }
    },
    [isAnswered, question.answer],
  );

  const handleNext = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < QUIZ_QUESTIONS.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  }, [currentQuestion]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto px-8 py-20"
    >
      <header className="mb-20 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/5 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-primary/10"
        >
          <Sparkles size={12} aria-hidden="true" /> Test Your Civic Knowledge
        </motion.div>
        <h2 className="text-5xl font-serif font-black text-slate-900 mb-6 italic leading-tight">Election Intelligence Quiz</h2>
        <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Validate your understanding of the democratic process and earn your badge of civic readiness.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {showResult ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-16 text-center shadow-2xl relative overflow-hidden bg-gradient-to-br from-brand-primary/5 to-blue-500/5"
            role="status"
            aria-live="polite"
          >
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 text-brand-primary shadow-xl border-4 border-white"
                aria-hidden="true"
              >
                <Award size={48} />
              </motion.div>
              <h3 className="text-5xl font-serif font-black text-slate-900 mb-4 italic">Evaluation Complete!</h3>
              <p className="text-xl text-slate-600 mb-12 font-medium">
                Your civic IQ score: <span className="text-brand-primary text-3xl font-black">{score}</span> / <span className="text-slate-900">{QUIZ_QUESTIONS.length}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <div className="p-8 bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-white shadow-premium group hover:bg-white transition-colors">
                  <div className="text-4xl font-black text-slate-900 mb-2">{percentageScore}%</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-brand-primary transition-colors">Precision Rating</div>
                </div>
                <div className="p-8 bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-white shadow-premium group hover:bg-white transition-colors">
                  <div className="text-4xl font-black text-slate-900 mb-2">{QUIZ_QUESTIONS.length}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-brand-primary transition-colors">Total Evaluated</div>
                </div>
              </div>

              <button onClick={resetQuiz} className="btn-primary w-full sm:w-auto mx-auto flex items-center gap-3 !px-12 !py-5" aria-label="Retake the quiz">
                <RefreshCcw size={20} aria-hidden="true" /> Retake Evaluation
              </button>
            </div>

            {/* Background Graphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="premium-card overflow-hidden border-2 border-white/50"
          >
            {/* Progress Bar */}
            <div className="h-2.5 bg-slate-100/50 w-full relative">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-primary to-blue-500 shadow-lg shadow-brand-primary/20"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.8 }}
                role="progressbar"
                aria-valuenow={currentQuestion + 1}
                aria-valuemin={1}
                aria-valuemax={QUIZ_QUESTIONS.length}
                aria-label={`Question ${currentQuestion + 1} of ${QUIZ_QUESTIONS.length}`}
              />
            </div>

            <div className="p-10 md:p-16">
              <div className="flex items-center gap-3 text-brand-primary mb-10 font-black text-[11px] uppercase tracking-[0.3em]">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10" aria-hidden="true">
                  <Star size={14} />
                </div>
                Metric {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
              </div>

              <h3 className="text-4xl font-serif font-black text-slate-900 mb-14 leading-tight italic">
                {question.question}
              </h3>

              <div className="space-y-5" role="radiogroup" aria-label="Answer options">
                {question.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleOptionClick(idx)}
                    role="radio"
                    aria-checked={selectedOption === idx}
                    aria-label={`Option ${String.fromCharCode(65 + idx)}: ${option}`}
                    disabled={isAnswered}
                    className={`w-full text-left p-7 rounded-[2rem] border-2 transition-all flex items-center justify-between group focus-ring ${
                      isAnswered
                        ? idx === question.answer
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10'
                          : idx === selectedOption
                            ? 'border-red-500 bg-red-50 shadow-lg shadow-red-500/10'
                            : 'border-slate-100 text-slate-400 opacity-50'
                        : 'border-white bg-white/60 hover:bg-white hover:shadow-xl hover:border-brand-primary/20'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-colors ${
                          isAnswered && idx === question.answer ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                        aria-hidden="true"
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-bold text-lg">{option}</span>
                    </div>
                    {isAnswered && idx === question.answer && <CheckCircle2 size={24} className="text-emerald-500" aria-hidden="true" />}
                    {isAnswered && idx === selectedOption && idx !== question.answer && <XCircle size={24} className="text-red-500" aria-hidden="true" />}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-12 space-y-8"
                  >
                    <div
                      className={`p-8 rounded-[2.5rem] border-2 shadow-inner transition-all duration-500 ${
                        selectedOption === question.answer
                          ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
                          : 'bg-red-50/50 border-red-100 text-red-900'
                      }`}
                      role="alert"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <HelpCircle size={20} className="text-current opacity-50" aria-hidden="true" />
                        <h4 className="font-black text-xs uppercase tracking-[0.3em]">Civic Insight</h4>
                      </div>
                      <p className="text-lg font-medium leading-relaxed italic">{question.explanation}</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="btn-primary w-full flex items-center justify-center gap-3 !py-6"
                      aria-label={currentQuestion + 1 === QUIZ_QUESTIONS.length ? 'Finalize your score' : 'Go to next question'}
                    >
                      {currentQuestion + 1 === QUIZ_QUESTIONS.length ? 'Finalize Score' : 'Next Challenge'}{' '}
                      <ArrowRight size={22} aria-hidden="true" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Quiz;
