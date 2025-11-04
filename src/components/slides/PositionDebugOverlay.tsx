/**
 * Debug overlay to show actual positioning values
 * Shows what VisualCanvas is rendering vs what we calculated
 */

interface PositionDebugOverlayProps {
  calculatedPosition: { x: number; y: number };
  calculatedSize: { width: number; height: number };
  actualElement?: HTMLElement | null;
}

export function PositionDebugOverlay({ calculatedPosition, calculatedSize, actualElement }: PositionDebugOverlayProps) {
  const actualPosition = actualElement ? {
    x: actualElement.offsetLeft,
    y: actualElement.offsetTop,
    width: actualElement.offsetWidth,
    height: actualElement.offsetHeight,
  } : null;

  return (
    <div className="fixed top-20 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-[100] max-w-xs">
      <div className="font-bold mb-2">🔍 Position Debug</div>
      
      <div className="mb-3">
        <div className="text-yellow-400">Calculated (Our Code):</div>
        <div>X: {calculatedPosition.x}px</div>
        <div>Y: {calculatedPosition.y}px</div>
        <div>W: {calculatedSize.width}px</div>
        <div>H: {calculatedSize.height}px</div>
      </div>

      {actualPosition && (
        <div className="mb-3">
          <div className="text-green-400">Actual (DOM):</div>
          <div>X: {actualPosition.x}px</div>
          <div>Y: {actualPosition.y}px</div>
          <div>W: {actualPosition.width}px</div>
          <div>H: {actualPosition.height}px</div>
        </div>
      )}

      {actualPosition && (
        <div className="border-t border-white/30 pt-2 mt-2">
          <div className="text-red-400">Difference:</div>
          <div>ΔX: {Math.abs(actualPosition.x - calculatedPosition.x)}px</div>
          <div>ΔY: {Math.abs(actualPosition.y - calculatedPosition.y)}px</div>
        </div>
      )}

      <div className="border-t border-white/30 pt-2 mt-2 text-[10px] text-gray-400">
        Press Ctrl+Shift+D to toggle
      </div>
    </div>
  );
}
