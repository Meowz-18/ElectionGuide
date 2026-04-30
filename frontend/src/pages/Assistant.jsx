/**
 * @file Assistant page component.
 * Provides an AI-powered chat interface for election-related queries.
 * Uses the useChat custom hook for state management and API communication.
 */

import React, { useCallback, memo } from 'react';
import { Send, Sparkles, User, Mic, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../hooks/useChat';
import { QUICK_QUESTIONS, MAX_QUERY_LENGTH } from '../constants';

/**
 * Individual chat message bubble component.
 * Memoized to prevent unnecessary re-renders during chat updates.
 * @param {Object} props
 * @param {Object} props.msg - The message object containing id, type, text, timestamp, isError.
 */
const ChatMessage = memo(function ChatMessage({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="shrink-0 mt-auto mb-1" aria-hidden="true">
          {msg.type === 'user' ? (
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
              <User size={20} className="text-slate-500" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border-2 border-white shadow-sm flex items-center justify-center">
              <Sparkles size={20} className="text-brand-primary" />
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-2 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
          <div
            role="log"
            className={`p-6 rounded-[2rem] text-base leading-relaxed shadow-premium border-2 transition-all hover:shadow-xl ${
              msg.type === 'user'
                ? 'bg-brand-primary text-white border-white/20 rounded-br-none'
                : msg.isError
                  ? 'bg-red-50/80 backdrop-blur-sm border-red-200/50 text-red-900 rounded-bl-none'
                  : 'bg-white/70 backdrop-blur-sm border-white/80 text-slate-800 rounded-bl-none'
            }`}
          >
            {msg.text}
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">
            {msg.timestamp}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

/** Typing indicator shown when the bot is generating a response. */
const TypingIndicator = memo(function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full justify-start"
      role="status"
      aria-label="Assistant is typing"
    >
      <div className="flex gap-4 max-w-[80%] flex-row">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border-2 border-white shadow-sm flex shrink-0 items-center justify-center mt-auto mb-1" aria-hidden="true">
          <Sparkles size={20} className="text-brand-primary" />
        </div>
        <div className="bg-white/70 backdrop-blur-sm border-2 border-white/80 p-6 rounded-[2rem] rounded-bl-none shadow-premium flex flex-col items-center gap-2">
          <div className="uiverse-loader scale-50" aria-hidden="true">
            <Sparkles size={16} />
          </div>
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest animate-pulse">Processing Query...</span>
        </div>
      </div>
    </motion.div>
  );
});

/**
 * Main AI Assistant chat page.
 * @returns {React.ReactElement} The rendered assistant interface.
 */
const Assistant = () => {
  const { messages, inputValue, setInputValue, isTyping, messagesEndRef, handleSend } = useChat();

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleQuickQuestion = useCallback(
    (q) => setInputValue(q),
    [setInputValue],
  );

  const isInputValid = inputValue.trim().length > 0 && inputValue.trim().length <= MAX_QUERY_LENGTH;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-80px)] bg-transparent"
    >
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-3xl border-b border-white/60 px-8 py-5 flex items-center justify-between shrink-0 z-10 shadow-glass">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner" aria-hidden="true">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="font-serif font-black text-slate-900 text-lg italic">Election Assistant</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Neural Knowledge Node Active</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/60 rounded-xl border border-white/80 shadow-sm">
          <ShieldCheck size={18} className="text-brand-primary" aria-hidden="true" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Secure AES-256 Protocol</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar relative" role="log" aria-live="polite" aria-label="Chat messages">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 md:p-12 bg-white/40 backdrop-blur-3xl border-t border-white/60 shrink-0 shadow-glass">
        <div className="max-w-4xl mx-auto">
          {/* Quick Questions */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar scroll-smooth" role="list" aria-label="Suggested questions">
            {QUICK_QUESTIONS.map((q, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickQuestion(q)}
                className="whitespace-nowrap px-6 py-3 rounded-2xl bg-white/60 border-2 border-white/80 text-[11px] font-black text-slate-600 hover:text-brand-primary transition-all flex items-center gap-2 shrink-0 shadow-sm focus-ring uppercase tracking-widest"
                role="listitem"
                aria-label={`Ask: ${q}`}
              >
                {q} <ChevronRight size={14} className="text-brand-primary/40" aria-hidden="true" />
              </motion.button>
            ))}
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 bg-white/60 backdrop-blur-md border-2 border-white/80 rounded-[2rem] flex items-center pr-3 focus-within:ring-8 focus-within:ring-brand-primary/5 focus-within:border-brand-primary/30 transition-all duration-500 shadow-premium group">
              <label htmlFor="chat-input" className="sr-only">Type your election question</label>
              <input
                id="chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Query the Election Knowledge Node..."
                maxLength={MAX_QUERY_LENGTH}
                className="flex-1 bg-transparent py-5 px-8 text-base text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none font-medium"
                aria-label="Type your election question"
              />
              <button
                onClick={handleSend}
                disabled={!isInputValid}
                className={`uiverse-btn !p-2 !w-12 !h-12 ${!isInputValid ? 'opacity-50 grayscale' : ''}`}
                aria-label="Send message"
              >
                <Send size={20} className="relative z-10" aria-hidden="true" />
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-[1.5rem] bg-white border-2 border-white text-slate-400 hover:text-brand-primary transition-all shrink-0 flex items-center justify-center focus-ring shadow-premium"
              aria-label="Voice input"
            >
              <Mic size={24} aria-hidden="true" />
            </motion.button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]" aria-hidden="true">
            <Info size={12} /> Privacy Guaranteed • Verified Sources Only • Live AI Insights
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Assistant;
