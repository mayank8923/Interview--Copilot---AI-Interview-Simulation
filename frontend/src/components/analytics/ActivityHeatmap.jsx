import React, { useState, useEffect } from 'react';
import { getUserStreak } from '../../api/activityApi';
import { Flame, Trophy, Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const ActivityHeatmap = () => {
  const [activity, setActivity] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getUserStreak();
        if (isMounted && data) {
          setActivity(data);
        }
      } catch (e) {
        console.warn("Failed to load streak activity", e);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const calendar = activity?.activityCalendar || {};
  const currentStreak = activity?.currentStreak || 0;
  const longestStreak = activity?.longestStreak || 0;
  const totalActiveDays = activity?.totalActiveDays || 0;
  const isActiveToday = activity?.isActiveToday || false;

  // Build grid of past 12 weeks (84 days)
  const days = [];
  const today = new Date();
  
  // Align ending at today
  for (let i = 83; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = calendar[dateStr] || 0;
    days.push({
      date: d,
      dateStr,
      count
    });
  }

  const getIntensityClass = (count) => {
    if (count === 0) return 'bg-stone-100 dark:bg-[#18191f] border border-stone-200/80 dark:border-stone-800/80';
    if (count === 1) return 'bg-amber-500/30 border border-amber-500/40 text-amber-900 dark:text-amber-200';
    if (count === 2) return 'bg-amber-500/60 border border-amber-500/70 text-amber-950';
    return 'bg-gradient-to-tr from-amber-500 to-orange-500 border border-amber-400 shadow-sm shadow-amber-500/20 text-stone-950 font-bold';
  };

  return (
    <div className="bg-white/80 dark:bg-[#131418] backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800/80 shadow-sm space-y-5 animate-fade-up">
      
      {/* Header with Stats Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-stone-950 font-bold shadow-sm shadow-amber-500/20">
            <Flame className="w-5 h-5 fill-stone-950" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
              Practice Streaks & Activity Calendar
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Your consistency tracking across coding, mocks, and voice interview rounds.
            </p>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block leading-none">Streak</span>
              <strong className="text-sm font-black text-stone-900 dark:text-white leading-none">{currentStreak} Days</strong>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#18191f] border border-stone-200 dark:border-stone-800 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block leading-none">Best</span>
              <strong className="text-sm font-black text-stone-900 dark:text-white leading-none">{longestStreak} Days</strong>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#18191f] border border-stone-200 dark:border-stone-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block leading-none">Active</span>
              <strong className="text-sm font-black text-stone-900 dark:text-white leading-none">{totalActiveDays} Days</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="font-semibold">Last 12 Weeks Activity (84 Days)</span>
          {hoveredDay ? (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {hoveredDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: <strong>{hoveredDay.count} {hoveredDay.count === 1 ? 'activity' : 'activities'}</strong>
            </span>
          ) : (
            <span className="text-stone-400 text-[11px]">Hover over squares to see daily activity</span>
          )}
        </div>

        {/* 12 Columns x 7 Rows Grid (or horizontal wrap) */}
        <div className="overflow-x-auto pb-1">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
            {days.map((day, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md transition-all cursor-pointer hover:scale-125 hover:z-10 ${getIntensityClass(day.count)}`}
                title={`${day.dateStr}: ${day.count} activities`}
              />
            ))}
          </div>
        </div>

        {/* Legend & Today's Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-stone-400">Less</span>
            <span className="w-3 h-3 rounded-sm bg-stone-100 dark:bg-[#18191f] border border-stone-200 dark:border-stone-800" />
            <span className="w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500/40" />
            <span className="w-3 h-3 rounded-sm bg-amber-500/60 border border-amber-500/70" />
            <span className="w-3 h-3 rounded-sm bg-gradient-to-tr from-amber-500 to-orange-500 border border-amber-400" />
            <span className="text-[11px] font-medium text-stone-400">More</span>
          </div>

          <div className="flex items-center gap-2">
            {isActiveToday ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Today's goal completed! Streak extended.</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span>Practice today to maintain your {currentStreak}-day streak!</span>
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

