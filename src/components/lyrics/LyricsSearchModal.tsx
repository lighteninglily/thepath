/**
 * Lyrics Search Modal
 * Search and import song lyrics using Lyricist API
 */

import { useState } from 'react';
import { X, Search, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { searchLyrics, cleanLyrics, type LyricsSearchResult } from '../../services/lyricsApi';

interface LyricsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: { title: string; artist: string; lyrics: string }) => void;
}

export function LyricsSearchModal({ isOpen, onClose, onImport }: LyricsSearchModalProps) {
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<LyricsSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!trackName.trim()) {
      setError('Please enter a song title');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    try {
      const result = await searchLyrics(trackName, artistName || undefined);
      setSearchResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search lyrics');
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = () => {
    if (!searchResult) return;

    onImport({
      title: searchResult.title,
      artist: searchResult.artist,
      lyrics: cleanLyrics(searchResult.lyrics),
    });

    // Reset and close
    setTrackName('');
    setArtistName('');
    setSearchResult(null);
    setError(null);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-brand-warmGray flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Search Lyrics</h2>
            <p className="text-sm text-brand-umber mt-1">
              Search by song title and artist to import lyrics
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-warmGray/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-brand-umber" />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-brand-warmGray">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Song Title *
              </label>
              <input
                type="text"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Goodness of God"
                className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-clay"
                disabled={isSearching}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Artist (Optional)
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Bethel Music"
                className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-clay"
                disabled={isSearching}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isSearching || !trackName.trim()}
                className="px-6 py-2 bg-brand-clay text-white rounded-lg hover:bg-brand-clay/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[42px]"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Licensing Notice */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>⚖️ Licensing Notice:</strong> Ensure you have proper licensing (CCLI, LicenSing, etc.) 
              to use these lyrics. Remember to add the CCLI number after importing.
            </p>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {searchResult && (
            <div className="space-y-4">
              {/* Result Header */}
              <div className="flex items-start justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-green-900">{searchResult.title}</h3>
                    {searchResult.artist && (
                      <p className="text-sm text-green-700 mt-1">by {searchResult.artist}</p>
                    )}
                    <p className="text-xs text-green-600 mt-1">Source: {searchResult.source}</p>
                  </div>
                </div>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-brand-clay text-white rounded-lg hover:bg-brand-clay/90 text-sm font-medium"
                >
                  Import Lyrics
                </button>
              </div>

              {/* Lyrics Preview */}
              <div>
                <h4 className="font-medium text-brand-charcoal mb-2">Lyrics Preview:</h4>
                <div className="p-4 bg-brand-warmGray/10 rounded-lg border border-brand-warmGray max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-brand-charcoal leading-relaxed">
                    {searchResult.lyrics}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {!error && !searchResult && !isSearching && (
            <div className="text-center py-12 text-brand-umber">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Search for lyrics</p>
              <p className="text-sm mt-2">Enter a song title and optional artist name to find lyrics</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-warmGray flex justify-between items-center">
          <p className="text-xs text-brand-umber">
            Tip: For best results, use the exact song title and artist name
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-brand-warmGray text-brand-charcoal rounded-lg hover:bg-brand-warmGray/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
