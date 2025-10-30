import { X, Music, Search, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Song } from '../../types';

interface AddSongToServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  onAddSong: (song: Song) => void;
}

export function AddSongToServiceModal({ isOpen, onClose, songs, onAddSong }: AddSongToServiceModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSong = (song: Song) => {
    onAddSong(song);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-warmGray">
          <div className="flex items-center gap-3">
            <Music size={24} className="text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">Add Song to Service</h2>
              <p className="text-sm text-brand-umber mt-0.5">
                Choose from {songs.length} songs in your library
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-warmGray rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-brand-warmGray">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-umber" />
            <input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
              autoFocus
            />
          </div>
        </div>

        {/* Songs List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-12">
              <Music size={48} className="mx-auto text-brand-umber/40 mb-3" />
              <p className="text-brand-umber">
                {searchTerm ? 'No songs found matching your search' : 'No songs in library yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSongs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => handleAddSong(song)}
                  className="w-full text-left p-4 rounded-lg border border-brand-warmGray hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-brand-charcoal group-hover:text-purple-700 truncate">
                        {song.title}
                      </h3>
                      <p className="text-sm text-brand-umber truncate">
                        {song.artist || 'Unknown Artist'}
                      </p>
                    </div>
                    <Plus 
                      size={20} 
                      className="ml-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-warmGray bg-brand-offWhite">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-brand-charcoal hover:bg-brand-warmGray rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
