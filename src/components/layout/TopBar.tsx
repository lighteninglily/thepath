import React from 'react';
import { Search, Play } from 'lucide-react';

interface TopBarProps {
  title: string;
  onStartPresentation?: () => void;
}

export function TopBar({ title, onStartPresentation }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-brand-warmGray flex items-center justify-between px-6 shadow-sm">
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-brand-charcoal">{title}</h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-umber"
          />
          <input
            type="text"
            placeholder="Search..."
            className="
              pl-10 pr-4 py-2 w-64 rounded-lg
              border border-brand-warmGray
              bg-brand-offWhite
              text-brand-charcoal placeholder-brand-umber
              focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
              transition-all
            "
          />
        </div>

        {/* Start Presentation Button */}
        {onStartPresentation && (
          <button
            onClick={onStartPresentation}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-brand-skyBlue text-white
              hover:bg-brand-powderBlue
              transition-all duration-200
              shadow-md hover:shadow-lg
              font-medium
            "
          >
            <Play size={18} />
            <span>Present</span>
          </button>
        )}
      </div>
    </header>
  );
}
