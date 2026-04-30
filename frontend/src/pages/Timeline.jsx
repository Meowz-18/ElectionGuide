/**
 * @file Timeline page component.
 * Displays the election cycle milestones in a vertical timeline format
 * with Google Calendar integration for event scheduling.
 */

import React, { useCallback, memo } from 'react';
import { Calendar, Clock, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { TIMELINE_EVENTS } from '../constants';
import { formatGoogleCalendarDate, openGoogleCalendarEvent } from '../utils/helpers';

/** Status badge style map for consistent theming. */
const STATUS_STYLES = Object.freeze({
  Completed: 'bg-slate-100/50 text-slate-400 border-slate-200/50',
  Ongoing: 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20',
  Upcoming: 'bg-white/50 text-slate-400 border-slate-200/50',
});

/** Timeline dot style map. */
const DOT_STYLES = Object.freeze({
  Completed: 'bg-slate-300',
  Ongoing: 'bg-brand-primary animate-pulse shadow-lg shadow-brand-primary/40',
  Upcoming: 'bg-slate-100',
});

/**
 * Individual timeline event card component.
 * Memoized to avoid unnecessary re-renders when sibling events update.
 * @param {Object} props
 * @param {Object} props.event - The timeline event data.
 * @param {number} props.index - The index for animation delay.
 */
const TimelineCard = memo(function TimelineCard({ event, index }) {
  const handleAddToCalendar = useCallback(() => {
    const dates = formatGoogleCalendarDate(event.date);
    openGoogleCalendarEvent(event.title, dates);
  }, [event.date, event.title]);

  return (
    <motion.article
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-12 md:pl-20 group"
    >
      {/* Timeline Dot */}
      <div
        className={`absolute -left-[14px] top-0 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 transition-all duration-500 group-hover:scale-125 ${DOT_STYLES[event.status]}`}
        aria-hidden="true"
      />

      {/* Date Tag */}
      <div className="absolute -left-32 md:-left-40 top-0 hidden md:block w-28 text-right" aria-hidden="true">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-primary transition-colors duration-300">
          {event.date.split(',')[0]}
        </span>
        <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{event.date.split(',')[1]}</div>
      </div>

      {/* Card Content */}
      <div
        className={`premium-card p-10 border-2 transition-all duration-500 group-hover:shadow-2xl bg-gradient-to-br ${event.gradient} ${
          event.status === 'Ongoing' ? 'border-brand-primary/30 shadow-xl shadow-brand-primary/5' : 'border-white/50'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Calendar size={16} className="text-brand-primary" aria-hidden="true" />
            <time dateTime={new Date(event.date).toISOString().split('T')[0]}>{event.date}</time>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-colors ${STATUS_STYLES[event.status]}`}>
            {event.status}
          </span>
        </div>

        <h3 className="text-3xl font-serif font-black text-slate-900 mb-4 italic leading-tight group-hover:text-brand-primary transition-colors duration-300">
          {event.title}
        </h3>
        <p className="text-base text-slate-600 font-medium mb-8 leading-relaxed max-w-xl">
          This is a critical <span className="text-brand-primary font-bold">{event.type}</span> milestone that defines the trajectory of the election cycle.
        </p>

        <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-100/50">
          <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Clock size={16} className="text-slate-300" aria-hidden="true" /> 08:00 AM - 08:00 PM
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <MapPin size={16} className="text-slate-300" aria-hidden="true" /> Nationwide
          </div>
          <div className="ml-auto flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleAddToCalendar}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors"
              aria-label={`Add ${event.title} to Google Calendar`}
            >
              <Calendar size={14} aria-hidden="true" /> Add Event
            </motion.button>
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-blue-700 transition-colors"
              aria-label={`Learn more about ${event.title}`}
            >
              Learn More <ChevronRight size={14} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

TimelineCard.propTypes = {
  event: PropTypes.shape({
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['Completed', 'Ongoing', 'Upcoming']).isRequired,
    gradient: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * Election Cycle Timeline page.
 * @returns {React.ReactElement} The rendered timeline interface.
 */
const Timeline = () => {
  const handleAddElectionDay = useCallback(() => {
    const details = 'Remember to vote today! Check your polling location and bring any necessary identification.';
    openGoogleCalendarEvent('Election Day', '20241105T130000Z/20241106T010000Z', details);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="max-w-5xl mx-auto px-8 py-20"
    >
      <header className="mb-24 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/5 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-primary/10"
        >
          <Sparkles size={12} aria-hidden="true" /> Roadmap to the Ballot Box
        </motion.div>
        <h2 className="text-5xl font-serif font-black text-slate-900 mb-6 italic leading-tight">Election Cycle Timeline</h2>
        <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Stay ahead of the curve. Track every critical milestone and deadline of the current election cycle.
        </p>
      </header>

      <div className="relative border-l-4 border-slate-100/50 ml-8 md:ml-12 space-y-16 pb-20" role="list" aria-label="Election timeline events">
        {TIMELINE_EVENTS.map((event, idx) => (
          <TimelineCard key={`${event.date}-${event.title}`} event={event} index={idx} />
        ))}
      </div>

      {/* Calendar Sync CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 p-10 bg-white/40 backdrop-blur-3xl rounded-[3rem] border-2 border-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-glass"
      >
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 rounded-[1.5rem] bg-brand-primary flex items-center justify-center text-white shadow-xl shadow-brand-primary/30" aria-hidden="true">
            <Calendar size={32} />
          </div>
          <div>
            <h4 className="font-serif font-black text-slate-900 text-2xl italic mb-1">Never miss a deadline.</h4>
            <p className="text-slate-500 text-base font-medium">Add Election Day to your Google Calendar.</p>
          </div>
        </div>
        <button onClick={handleAddElectionDay} className="btn-primary whitespace-nowrap !px-10" aria-label="Add Election Day to Google Calendar">
          Add to Google Calendar
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Timeline;
