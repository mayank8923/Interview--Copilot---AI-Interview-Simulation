import React, { useState, useEffect } from 'react';
import { getUserStreak } from '../../api/activityApi';
import { Flame, Trophy, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const StreakBadge = () => {
  const [activity, setActivity] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStreak = async () => {
      try {
        const data = await getUserStreak();
        if (isMounted && data) {
          setActivity(data);
        }
      } catch (err) {
        // Silently fail if not logged in or offline
      }
    };

    fetchStreak();
    return () => { isMounted = false; };
  }, []);

  if (!activity) return null;

  const currentStreak = activity.currentStreak || 0;
  const longestStreak = activity.longestStreak || 0;
  const isActiveToday = activity.isActiveToday;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all select-none ${
          isActiveToday
            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
            : currentStreak > 0
            ? 'bg-stone-100 dark:bg-[#18191f] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-500/40'
            : 'bg-stone-100 dark:bg-[#18191f] text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-800'
        }`}
        title={`${currentStreak}-day streak`}
      >
        <Flame className={`w-3.5 h-3.5 ${
          isActiveToday 
            ? 'fill-amber-500 text-amber-500 animate-pulse' 
            : currentStreak > 0 
            ? 'text-amber-500' 
            : 'text-stone-400'
        }`} />
        <span>{currentStreak}</span>
      </button>

      {/* Popover / Tooltip */}
      {showTooltip && (
        <div 
          className="absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-white dark:bg-[#16171d] border border-stone-200 dark:border-stone-800 shadow-xl z-50 text-left animate-fade-in"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-stone-950 font-bold shadow-sm">
                <Flame className="w-4 h-4 fill-stone-950" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-white block leading-tight">
                  {currentStreak} Day Streak
                </span>
                <span className="text-[10px] text-stone-400">
                  {isActiveToday ? 'Daily goal completed!' : 'Practice today to maintain!'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best Streak
              </span>
              <strong className="text-stone-900 dark:text-white font-mono">{longestStreak} days</strong>
            </div>

            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" /> Active Days
              </span>
              <strong className="text-stone-900 dark:text-white font-mono">{activity.totalActiveDays || 0} days</strong>
            </div>

            <div className="pt-2 mt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Today's Practice:</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isActiveToday 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                {isActiveToday ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {isActiveToday ? 'Active' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

