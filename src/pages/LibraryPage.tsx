import { useState } from 'react';
import { Music, Plus, Loader2, Zap } from 'lucide-react';
import { useSongs, useCreateSong, useUpdateSong, useDeleteSong } from '../hooks/useSongs';
import { SongCard } from '../components/songs/SongCard';
import { SongFormModal } from '../components/songs/SongFormModal';
import { QuickGenerateModal } from '../components/songs/QuickGenerateModal';
import { PresentationModal } from '../components/presentation/PresentationModal';
import type { Song, CreateSongInput } from '../types';
import type { GenerationResult } from '../services/slideGeneratorService';

export function LibraryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [presentingSong, setPresentingSong] = useState<Song | null>(null);
  const [showQuickGenerate, setShowQuickGenerate] = useState(false);

  const { data: songs, isLoading } = useSongs();
  const createSong = useCreateSong();
  const updateSong = useUpdateSong();
  const deleteSong = useDeleteSong();

  const handleOpenModal = (song?: Song) => {
    if (song) {
      setEditingSong(song);
    } else {
      setEditingSong(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSong(null);
  };

  const handleSubmit = async (data: CreateSongInput) => {
    try {
      console.log('Submitting song:', data);
      
      if (editingSong) {
        // UPDATE existing song
        console.log('🔄 Updating song:', editingSong.id);
        console.log('📝 Update data:', data);
        const result = await updateSong.mutateAsync({ 
          id: editingSong.id, 
          data 
        });
        console.log('✅ Song updated:', result);
      } else {
        // CREATE new song
        console.log('➕ Creating new song');
        const result = await createSong.mutateAsync(data);
        console.log('✅ Song created:', result);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('❌ Error saving song:', error);
      alert('Failed to save song. Please try again.');
    }
  };

  const handleDelete = async (song: Song) => {
    if (!confirm(`Are you sure you want to delete "${song.title}"?`)) {
      return;
    }

    try {
      await deleteSong.mutateAsync(song.id);
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Failed to delete song. Please try again.');
    }
  };

  const handlePresent = (song: Song) => {
    setPresentingSong(song);
  };

  const handleClosePresentation = () => {
    setPresentingSong(null);
  };

  const handleQuickGenerateComplete = async (result: GenerationResult) => {
    try {
      console.log('✨ AI Generation complete:', result);
      
      // Create song object from AI-generated result
      const songData: CreateSongInput = {
        title: result.songInfo.title,
        artist: result.songInfo.artist,
        lyrics: result.songInfo.lyrics,
        slidesData: result.slides.map(slide => ({
          id: slide.id,
          content: slide.content,
          backgroundId: slide.backgroundId,
          layout: slide.layout,
          type: slide.type as 'verse' | 'chorus' | 'bridge' | 'title' | 'custom',
          order: slide.order,
          visualData: slide.visualData
        })),
        designTheme: null, // Using visualData for AI-generated slides
        ccliNumber: '',
        key: null,
        tempo: null,
        tags: ['ai-generated'],
        backgroundId: result.slides[0]?.backgroundId || null
      };

      // Save using existing createSong mutation
      await createSong.mutateAsync(songData);
      
      console.log(`✅ Generated ${result.slides.length} slides with ${result.metadata.templateName}`);
    } catch (error) {
      console.error('❌ Failed to save AI-generated song:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-brand-skyBlue" />
      </div>
    );
  }

  const songCount = songs?.length || 0;

  // Empty state
  if (songCount === 0) {
    return (
      <>
        <div className="p-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-skyBlue/10 mb-6">
              <Music size={40} className="text-brand-skyBlue" />
            </div>
            
            <h2 className="text-2xl font-bold text-brand-charcoal mb-2">
              Your Song Library is Empty
            </h2>
            
            <p className="text-brand-umber mb-8 max-w-md mx-auto">
              Start building your worship library by adding songs manually. 
              You can add lyrics, choose templates, and organize with tags.
            </p>

            <button
              onClick={() => handleOpenModal()}
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-lg
                bg-brand-skyBlue text-white
                hover:bg-brand-powderBlue
                transition-all duration-200
                shadow-md hover:shadow-lg
                font-medium
              "
            >
              <Plus size={20} />
              Add Your First Song
            </button>

            <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl mx-auto">
              <div className="bg-white rounded-lg p-4 border border-brand-warmGray">
                <div className="text-3xl font-bold text-brand-skyBlue">0</div>
                <div className="text-sm text-brand-umber mt-1">Songs</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-brand-warmGray">
                <div className="text-3xl font-bold text-brand-taupe">5</div>
                <div className="text-sm text-brand-umber mt-1">Templates</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-brand-warmGray">
                <div className="text-3xl font-bold text-brand-clay">0</div>
                <div className="text-sm text-brand-umber mt-1">Services</div>
              </div>
            </div>
          </div>
        </div>

        <SongFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          song={editingSong}
          isLoading={createSong.isPending || updateSong.isPending}
        />
      </>
    );
  }

  // Songs list view
  return (
    <>
      <div className="p-8">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Song Library</h2>
            <p className="text-brand-umber mt-1">{songCount} {songCount === 1 ? 'song' : 'songs'} in your library</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowQuickGenerate(true)}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-lg
                bg-brand-skyBlue text-white
                hover:bg-brand-powderBlue
                transition-all duration-200
                shadow-md hover:shadow-lg
                font-medium
              "
            >
              <Zap size={20} />
              Quick Create
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-lg
                bg-brand-skyBlue text-white
                hover:bg-brand-powderBlue
                transition-all duration-200
                shadow-md hover:shadow-lg
                font-medium
              "
            >
              <Plus size={20} />
              Add Manual
            </button>
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs?.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onPresent={handlePresent}
            />
          ))}
        </div>
      </div>

      <SongFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        song={editingSong}
        isLoading={createSong.isPending || updateSong.isPending}
      />

      <QuickGenerateModal
        isOpen={showQuickGenerate}
        onClose={() => setShowQuickGenerate(false)}
        onComplete={handleQuickGenerateComplete}
      />

      {presentingSong && (
        <PresentationModal song={presentingSong} onClose={handleClosePresentation} />
      )}
    </>
  );
}
