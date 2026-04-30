/**
 * @file Guide page component.
 * Provides an interactive, step-by-step election registration guide
 * with animated transitions and contextual imagery.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GUIDE_STEPS } from '../constants';

/**
 * Interactive Election Process Guide page.
 * @returns {React.ReactElement} The rendered guide interface.
 */
const Guide = () => {
  const [activeStep, setActiveStep] = useState(1);

  /** Memoize the active step data to avoid repeated .find() calls during re-renders. */
  const currentStep = useMemo(
    () => GUIDE_STEPS.find((s) => s.id === activeStep),
    [activeStep],
  );

  const handleStepChange = useCallback((id) => setActiveStep(id), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto px-8 py-20"
    >
      <header className="mb-20 text-center">
        <h2 className="text-5xl font-serif font-black text-slate-900 mb-6 italic leading-tight">Election Process Guide</h2>
        <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Your definitive, step-by-step roadmap to a successful and informed voting experience.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Step Navigation */}
        <nav className="lg:col-span-4 space-y-4" aria-label="Guide steps navigation">
          {GUIDE_STEPS.map((step) => (
            <motion.button
              key={step.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStepChange(step.id)}
              aria-current={activeStep === step.id ? 'step' : undefined}
              aria-label={`Step ${step.id}: ${step.title}`}
              className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group focus-ring ${
                activeStep === step.id
                  ? 'border-brand-primary bg-white shadow-xl shadow-brand-primary/10'
                  : 'border-white bg-white/40 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-colors ${
                    activeStep === step.id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' : 'bg-slate-100 text-slate-400'
                  }`}
                  aria-hidden="true"
                >
                  {step.id}
                </span>
                <span className={`font-black text-base ${activeStep === step.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {step.title}
                </span>
              </div>
              <ChevronRight
                size={20}
                className={`${activeStep === step.id ? 'text-brand-primary translate-x-1' : 'text-slate-300'} transition-transform duration-300`}
                aria-hidden="true"
              />
            </motion.button>
          ))}
        </nav>

        {/* Step Content */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className={`premium-card p-12 min-h-[500px] relative overflow-hidden bg-gradient-to-br ${currentStep.gradient}`}
            >
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <div className="flex items-center gap-2 text-brand-primary mb-6 font-black text-xs uppercase tracking-[0.2em]">
                    <Info size={16} aria-hidden="true" /> Step {activeStep} of {GUIDE_STEPS.length}
                  </div>
                  <h3 className="text-4xl font-serif font-black text-slate-900 mb-6 italic">{currentStep.title}</h3>
                  <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">{currentStep.desc}</p>

                  <div className="space-y-6 mb-12">
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Key Requirements:</h4>
                    {currentStep.details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                        className="flex gap-4 bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-white/40 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-base text-slate-700 font-medium leading-relaxed">{detail}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-6 bg-amber-50/50 backdrop-blur-sm border border-amber-200/50 rounded-[1.5rem] flex gap-4"
                    role="alert"
                  >
                    <AlertCircle size={24} className="text-amber-600 shrink-0" aria-hidden="true" />
                    <p className="text-sm text-amber-900 font-medium leading-relaxed italic">
                      Rules and deadlines may change depending on your specific location. Always verify with your local election office for the most accurate information.
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="hidden md:flex flex-col items-center justify-center relative"
                >
                  <motion.img
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    src={currentStep.image}
                    alt={`Illustration for ${currentStep.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full max-w-sm h-auto aspect-square object-cover rounded-[3rem] shadow-2xl border-4 border-white/50 z-10"
                  />
                  <div className="absolute inset-0 bg-brand-primary/10 blur-3xl rounded-full scale-150 z-0" aria-hidden="true" />
                </motion.div>
              </div>

              {/* Background Graphic Element */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl" aria-hidden="true" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Guide;
