import { useSettingsStore } from '../../store/settingsStore';

/**
 * Blank screen component with multiple modes:
 * - Black screen (default)
 * - Church logo on solid background
 * - Custom slide
 * 
 * Used when presenter presses B to blank the screen
 */
export function BlankScreen() {
  const { presentation } = useSettingsStore();
  const { blankScreen } = presentation;

  switch (blankScreen.mode) {
    case 'logo':
      return (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: blankScreen.backgroundColor || '#000000' }}
        >
          {blankScreen.logoUrl ? (
            <img
              src={blankScreen.logoUrl}
              alt="Church Logo"
              className="max-w-[40vw] max-h-[40vh] object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))',
              }}
            />
          ) : (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">⛪</div>
              <div className="text-2xl opacity-60">Church Logo</div>
            </div>
          )}
        </div>
      );

    case 'custom':
      // Future: Load custom slide by ID
      return (
        <div
          className="w-full h-full flex items-center justify-center bg-gray-900"
        >
          <div className="text-white text-center max-w-2xl px-8">
            <div className="text-5xl font-bold mb-6">
              We'll Be Right Back
            </div>
            <div className="text-2xl opacity-75">
              Thank you for your patience
            </div>
          </div>
        </div>
      );

    case 'black':
    default:
      return <div className="w-full h-full bg-black" />;
  }
}
