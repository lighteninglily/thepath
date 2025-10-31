import { Music, Edit, Trash2, Palette, Play } from 'lucide-react';
import type { Song } from '../../types';

interface SongCardProps {
  song: Song;
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
  onPresent: (song: Song) => void;
}

export function SongCard({ song, onEdit, onDelete, onPresent }: SongCardProps) {
  return (
    <div className="
      bg-white rounded-lg border border-brand-warmGray
      p-4 hover:shadow-md transition-all duration-200
      group
    ">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Music size={18} className="text-brand-skyBlue" />
            <h3 className="font-semibold text-brand-charcoal">{song.title}</h3>
          </div>
          
          {song.artist && (
            <p className="text-sm text-brand-umber mb-2">{song.artist}</p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {song.designTheme && (
              <span className="text-xs px-2 py-1 rounded bg-brand-mistyBlue text-brand-skyBlue flex items-center gap-1">
                <Palette size={12} />
                Designed
              </span>
            )}
            {song.slidesData && (
              <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-600">
                {song.slidesData.length} slides
              </span>
            )}
            {song.key && (
              <span className="text-xs px-2 py-1 rounded bg-brand-skyBlue/10 text-brand-skyBlue">
                Key: {song.key}
              </span>
            )}
            {song.tempo && (
              <span className="text-xs px-2 py-1 rounded bg-brand-taupe/10 text-brand-taupe">
                {song.tempo} BPM
              </span>
            )}
            {song.ccliNumber && (
              <span className="text-xs px-2 py-1 rounded bg-brand-clay/10 text-brand-clay">
                CCLI #{song.ccliNumber}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onPresent(song)}
            className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
            title="Present this song"
          >
            <Play size={18} />
          </button>
          <button
            onClick={() => onEdit(song)}
            className="p-2 rounded-lg hover:bg-brand-skyBlue/10 text-brand-skyBlue transition-colors"
            title="Edit song"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(song)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
            title="Delete song"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
