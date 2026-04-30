/**
 * @file Landing page component.
 * The main hero page for VoteWise featuring a WebGL background,
 * feature showcase cards, and call-to-action sections.
 */

import React, { useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Shield, Globe, Users, Star } from 'lucide-react';
import PropTypes from 'prop-types';
import UnicornScene from 'unicornstudio-react';

/** @constant {Array} Feature cards displayed on the landing page. */
const FEATURES = Object.freeze([
  {
    title: 'Interactive Guide',
    desc: 'From registration to casting your ballot, we break down every technical requirement and deadline.',
    icon: CheckCircle,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    link: '/guide',
  },
  {
    title: 'Live Timeline',
    desc: 'Never miss a critical date. Our real-time timeline tracks every milestone in the election cycle.',
    icon: Globe,
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
    link: '/timeline',
  },
  {
    title: 'AI Knowledge Base',
    desc: 'Our neural guide provides instant, verified answers to complex voting laws and procedures.',
    icon: Shield,
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    link: '/assistant',
  },
  {
    title: 'Community Pulse',
    desc: 'Understand the localized impact of your vote through our data-driven community insight modules.',
    icon: Users,
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    link: '/quiz',
  },
]);

/**
 * Feature card component for the landing page grid.
 * Memoized to prevent re-renders when other cards update.
 * @param {Object} props
 * @param {Object} props.item - Feature data.
 */
const FeatureCard = memo(function FeatureCard({ item }) {
  return (
    <Link
      to={item.link}
      className="uiverse-card p-10 group hover:translate-y-[-8px] transition-all duration-500 flex gap-8 items-start relative overflow-hidden"
      aria-label={`Explore ${item.title}`}
    >
      <div
        className={`w-16 h-16 ${item.color} rounded-2xl border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10`}
        aria-hidden="true"
      >
        <item.icon size={32} />
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium mb-6">{item.desc}</p>
        <div className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-widest">
          Explore Module <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" aria-hidden="true" />
        </div>
      </div>

      {/* Uiverse-style animated element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-all duration-500 translate-x-10 -translate-y-10" aria-hidden="true" />
    </Link>
  );
});

FeatureCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
};

/**
 * Main landing / hero page for VoteWise.
 * @returns {React.ReactElement} The rendered landing page.
 */
const Landing = () => {
  useEffect(() => {
    /**
     * Uses a MutationObserver to efficiently remove third-party watermarks
     * injected by external SDKs, without polling the DOM on a timer.
     */
    const handleNode = (el) => {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
      const selectors = [
        'a[href*="unicorn.studio"]',
        '[class*="badge"]',
        '[class*="watermark"]',
        'div[style*="z-index: 2147483647"]',
      ];
      selectors.forEach((sel) => {
        if (el.matches?.(sel) && !el.closest('#unicorn-studio-canvas')) {
          el.style.setProperty('display', 'none', 'important');
        }
      });
      const text = el.innerText || el.textContent || '';
      if (text.toLowerCase().includes('made with') && text.toLowerCase().includes('unicorn')) {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('opacity', '0', 'important');
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => handleNode(node));
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section with Unicorn Scene */}
      <section className="relative min-h-[90vh] flex items-center pt-0 mt-0 overflow-hidden" aria-label="Hero section">
        {/* WebGL Background */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <UnicornScene
            projectId="ppCNCwCMgqj9ezEbkneG"
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js"
            width="100%"
            height="100%"
            style={{ opacity: 0.8 }}
          />
          {/* Overlay Gradient for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-base/20 to-bg-base z-0 pointer-events-none" />
        </div>

        <div className="max-w-6xl mx-auto px-8 lg:px-16 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
            <h2 className="text-6xl md:text-7xl font-serif font-black text-slate-900 mb-8 leading-[1.1] italic">
              Democracy, <br />
              <span className="text-brand-primary">Redefined.</span>
            </h2>
            <p className="text-xl text-slate-600 mb-12 max-w-lg font-medium leading-relaxed">
              Navigate the election process with confidence. Track milestones, learn your rights, and get AI-powered insights for a smarter vote.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/guide" className="btn-primary !px-10 !py-4 text-lg">
                Start the Guide <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <Link to="/assistant" className="btn-secondary !px-10 !py-4 text-lg">
                Ask AI Assistant
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt={`Voter ${i}`}
                      loading="lazy"
                      decoding="async"
                      width="40"
                      height="40"
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs font-bold text-slate-500">
                <div className="flex gap-0.5 text-amber-500 mb-0.5" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                Join 10k+ informed voters
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-8 lg:px-16 py-32 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <h3 className="text-4xl font-serif font-black text-slate-900 mb-6 italic leading-tight">
            Everything you need to make an informed decision.
          </h3>
          <div className="w-20 h-1.5 bg-brand-primary/20 rounded-full mx-auto" aria-hidden="true" />
        </div>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32" aria-label="Application features">
          {FEATURES.map((item) => (
            <FeatureCard key={item.link} item={item} />
          ))}
        </section>

        {/* Final CTA */}
        <section className="glass-effect rounded-[3.5rem] p-16 text-center border-2 border-white relative overflow-hidden group" aria-label="Call to action">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/5 rounded-full blur-3xl -ml-32 -mb-32" aria-hidden="true" />

          <h3 className="text-5xl font-serif font-black text-slate-900 mb-8 italic">Ready to make your voice heard?</h3>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto font-medium">
            Join a community of informed citizens using VoteWise to navigate the democratic landscape with clarity and precision.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/quiz" className="btn-primary !px-12 !py-5">
              Take the Quiz
            </Link>
            <Link to="/guide" className="btn-secondary !px-12 !py-5">
              View the Roadmap
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
