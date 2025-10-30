import { useServicePresentationStore } from '../store/servicePresentationStore';
import { ServiceItemSlidePreview } from '../components/slides/ServiceItemSlidePreview';

/**
 * Audience View - Full-screen display for projector/external screen
 * Shows only the current slide with no controls
 */
export function AudiencePage() {
  const {
    service,
    currentItemIndex,
    isBlank,
    isPresenting,
  } = useServicePresentationStore();

  if (!isPresenting || !service) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <p className="text-white text-2xl">Waiting for presentation...</p>
      </div>
    );
  }

  const currentItem = service.items[currentItemIndex];

  return (
    <div className="w-screen h-screen bg-black">
      {isBlank ? (
        <div className="w-full h-full bg-black" />
      ) : currentItem ? (
        <ServiceItemSlidePreview item={currentItem} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-white text-2xl">No slide to display</p>
        </div>
      )}
    </div>
  );
}
