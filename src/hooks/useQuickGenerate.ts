import { useMutation } from '@tanstack/react-query';
import { slideGeneratorService, GenerationProgress } from '../services/slideGeneratorService';
import { useState } from 'react';

export function useQuickGenerate() {
  const [progress, setProgress] = useState<GenerationProgress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ title, artist }: { title: string; artist: string }) => {
      return await slideGeneratorService.generateSongSlides(
        title,
        artist,
        (prog) => setProgress(prog)
      );
    },
    onSuccess: () => {
      setProgress(null);
    },
    onError: () => {
      setProgress(null);
    }
  });

  const availability = slideGeneratorService.checkAvailability();

  return {
    generate: mutation.mutate,
    generateAsync: mutation.mutateAsync,
    isGenerating: mutation.isPending,
    progress,
    error: mutation.error,
    availability,
    result: mutation.data
  };
}
