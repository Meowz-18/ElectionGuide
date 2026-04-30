/**
 * @file Application-wide constants and configuration.
 * Centralizes all static data, API endpoints, and configuration values
 * to ensure maintainability and single-source-of-truth across the codebase.
 */

/** @constant {string} API base URL for the VoteWise backend */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/** @constant {Object} API endpoint paths */
export const API_ENDPOINTS = Object.freeze({
  ASSISTANT: `${API_BASE_URL}/api/assistant`,
  HEALTH: `${API_BASE_URL}/api/health`,
});

/** @constant {number} Debounce delay in milliseconds for user input */
export const DEBOUNCE_DELAY_MS = 300;

/** @constant {number} Max character length for assistant queries */
export const MAX_QUERY_LENGTH = 500;

/** @constant {Object} Navigation items for the main layout */
export const NAV_ITEMS = Object.freeze([
  { path: '/', label: 'Home', iconName: 'Home' },
  { path: '/guide', label: 'Election Guide', iconName: 'Map' },
  { path: '/timeline', label: 'Timeline', iconName: 'Calendar' },
  { path: '/quiz', label: 'Quiz', iconName: 'HelpCircle' },
  { path: '/assistant', label: 'AI Assistant', iconName: 'MessageSquare', special: true },
]);

/** @constant {Array} Quick-action questions for the AI assistant */
export const QUICK_QUESTIONS = Object.freeze([
  'How do I register to vote?',
  'When is the next election?',
  'What ID do I need to bring?',
  'Can I vote by mail?',
]);

/** @constant {Array} Election guide steps data */
export const GUIDE_STEPS = Object.freeze([
  {
    id: 1,
    title: 'Voter Registration',
    desc: 'The first step to participating in any election. Check your eligibility and register online or in person.',
    details: [
      'Must be at least 18 years old by election day.',
      'Proof of citizenship and residency required.',
      'Registration deadlines vary by state (usually 15-30 days before).',
    ],
    gradient: 'from-blue-500/10 to-indigo-500/10',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    title: 'Research Candidates & Issues',
    desc: 'Stay informed about who is running and what policies they support. Review official voter guides.',
    details: [
      'Check candidate websites and public records.',
      'Read ballot measure descriptions carefully.',
      'Attend local town halls or watch debates.',
    ],
    gradient: 'from-emerald-500/10 to-teal-500/10',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    title: 'Find Your Polling Place',
    desc: 'Locate where you need to go on election day or learn about mail-in and early voting options.',
    details: [
      'Polling locations are assigned based on your address.',
      'Check for early voting dates and times in your area.',
      'Request a mail-in ballot if you cannot vote in person.',
    ],
    gradient: 'from-amber-500/10 to-orange-500/10',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    title: 'Cast Your Vote',
    desc: 'Be prepared on election day. Bring required ID and follow the instructions at your polling station.',
    details: [
      'Polls are usually open from early morning to evening.',
      'Ask poll workers for assistance if needed.',
      'You have the right to vote as long as you are in line by closing.',
    ],
    gradient: 'from-rose-500/10 to-pink-500/10',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=60',
  },
]);

/** @constant {Array} Election timeline events */
export const TIMELINE_EVENTS = Object.freeze([
  { date: 'Jan 15, 2024', title: 'Voter Registration Opens', type: 'Registration', status: 'Completed', gradient: 'from-slate-400/5 to-slate-500/5', color: 'slate' },
  { date: 'Feb 01, 2024', title: 'Primary Election Debates', type: 'Awareness', status: 'Completed', gradient: 'from-slate-400/5 to-slate-500/5', color: 'slate' },
  { date: 'Mar 05, 2024', title: 'Super Tuesday', type: 'Election', status: 'Ongoing', gradient: 'from-brand-primary/10 to-blue-500/10', color: 'blue' },
  { date: 'Oct 20, 2024', title: 'Early Voting Begins', type: 'Voting', status: 'Upcoming', gradient: 'from-emerald-400/5 to-teal-500/5', color: 'emerald' },
  { date: 'Nov 05, 2024', title: 'Election Day', type: 'Critical', status: 'Upcoming', gradient: 'from-brand-secondary/10 to-rose-500/10', color: 'red' },
  { date: 'Jan 20, 2025', title: 'Inauguration Day', type: 'Final', status: 'Upcoming', gradient: 'from-amber-400/5 to-orange-500/5', color: 'amber' },
]);

/** @constant {Array} Quiz questions data */
export const QUIZ_QUESTIONS = Object.freeze([
  {
    id: 1,
    question: 'What is the minimum age to register to vote in most elections?',
    options: ['16 years old', '18 years old', '21 years old', '25 years old'],
    answer: 1,
    explanation: 'In most jurisdictions, you must be 18 years old by election day to be eligible to vote.',
  },
  {
    id: 2,
    question: 'Which of these is typically required for voter registration?',
    options: ['Proof of income', 'A college degree', 'Proof of citizenship', 'Owning property'],
    answer: 2,
    explanation: 'Voter registration usually requires proof of citizenship and residency in the area where you are registering.',
  },
  {
    id: 3,
    question: 'What should you do if you are in line when the polls close?',
    options: ['Leave immediately', 'Stay in line to vote', 'Come back tomorrow', 'Call a lawyer'],
    answer: 1,
    explanation: 'If you are in line when the polls close, you have the right to stay in line and cast your vote.',
  },
  {
    id: 4,
    question: 'Can you register to vote on election day?',
    options: ['Yes, everywhere', 'No, never', 'Yes, in some states', 'Only for local elections'],
    answer: 2,
    explanation: 'Some states allow same-day voter registration, but others require you to register several weeks in advance.',
  },
]);
