import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { Home, Map, Calendar, MessageSquare, HelpCircle, User, Sparkles } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

const Landing = lazy(() => import('./pages/Landing'));
const Guide = lazy(() => import('./pages/Guide'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Quiz = lazy(() => import('./pages/Quiz'));

const MainLayout = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/guide', icon: Map, label: 'Election Guide' },
    { path: '/timeline', icon: Calendar, label: 'Timeline' },
    { path: '/quiz', icon: HelpCircle, label: 'Quiz' },
    { path: '/assistant', icon: MessageSquare, label: 'AI Assistant', special: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-base bg-mesh font-sans overflow-x-hidden m-0 p-0">
      <a href="#main-content" className="skip-to-content">Skip to Main Content</a>
      
      {/* Top Navigation (Translucent Glass) */}
      <header className="fixed top-0 left-0 right-0 w-full h-20 bg-white/40 backdrop-blur-3xl border-b border-white/20 flex items-center justify-between px-8 md:px-12 z-[100] shadow-glass transition-all duration-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-premium hover:scale-105 transition-transform duration-500 bg-white/20 backdrop-blur-md">
            <img src="/logo.png" alt="VoteWise Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-serif font-black tracking-tight text-slate-900 hidden sm:block italic">
            VoteWise
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 focus-ring flex items-center gap-2 ${
                isActive 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary'
              }`}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={item.special && !isActive ? "text-brand-secondary" : ""} aria-hidden="true" />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           <button className="hidden lg:flex uiverse-btn !py-2.5 !px-6 text-xs" aria-label="Sign In">
              Sign In
           </button>
           <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-white transition-colors shadow-sm" aria-label="User Profile">
              <User size={20} aria-hidden="true" />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 pt-20 focus:outline-none" tabIndex="-1">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex h-full items-center justify-center p-20">
              <div className="uiverse-loader">
                <Sparkles size={24} />
              </div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Mobile Nav Bar */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] h-16 flex justify-around items-center px-4 shadow-2xl z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center justify-center w-12 h-12 transition-all rounded-2xl ${
              isActive ? "text-brand-primary scale-110" : "text-slate-400"
            }`}
          >
            {({ isActive }) => (
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="guide" element={<Guide />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="quiz" element={<Quiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
