import { Plus, X, GripVertical } from 'lucide-react';

export interface SubPoint {
  id: string;
  content: string;
  order: number;
}

interface SubPointEditorProps {
  subPoints: SubPoint[];
  onAdd: () => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function SubPointEditor({
  subPoints,
  onAdd,
  onUpdate,
  onDelete,
  onReorder
}: SubPointEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          Sub-Points (max 4 recommended)
        </label>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={subPoints.length >= 4}
        >
          <Plus size={14} />
          Add Sub-Point
        </button>
      </div>

      {subPoints.length === 0 ? (
        <div className="text-sm text-gray-500 italic py-4 text-center border border-dashed border-gray-300 rounded">
          No sub-points. Click "Add Sub-Point" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {subPoints.map((subPoint, index) => (
            <div
              key={subPoint.id}
              className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {/* Drag Handle */}
              <button
                className="mt-2 text-gray-400 hover:text-gray-600 cursor-move"
                title="Drag to reorder"
              >
                <GripVertical size={16} />
              </button>

              {/* Bullet Marker */}
              <span className="mt-2 text-gray-600 font-bold">•</span>

              {/* Content Input */}
              <textarea
                value={subPoint.content}
                onChange={(e) => onUpdate(subPoint.id, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Enter sub-point text..."
              />

              {/* Delete Button */}
              <button
                onClick={() => onDelete(subPoint.id)}
                className="mt-1 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Delete sub-point"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {subPoints.length >= 4 && (
        <p className="text-xs text-amber-600 mt-2">
          ⚠️ Maximum 4 sub-points recommended to avoid crowding the slide
        </p>
      )}
    </div>
  );
}
