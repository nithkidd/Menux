import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import type { Item } from '../services/menu.service';

interface SortableItemProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export function SortableItem({ item, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex justify-between items-center py-3 border-b border-stone-100 dark:border-stone-800 last:border-0 group bg-white dark:bg-stone-900 ${isDragging ? 'z-50 shadow-lg' : ''}`}
    >
      <div className="flex items-center space-x-4 flex-1">
        {/* Drag Handle */}
        <div 
            {...attributes} 
            {...listeners}
            className="text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400 cursor-grab active:cursor-grabbing p-1 touch-none"
        >
            <GripVertical size={20} />
        </div>

        {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-stone-100 dark:bg-stone-800" />
        ) : (
             <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-300 dark:text-stone-600">
                <div className="w-6 h-6 rounded-full border-2 border-stone-200 dark:border-stone-700" /> 
             </div>
        )}
        
        <div>
            <div className="flex items-center">
                <span className="font-semibold text-stone-900 dark:text-white mr-2">{item.name}</span>
                {!item.is_available && <span className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-1.5 py-0.5 rounded">Sold Out</span>}
            </div>
            <div className="text-sm text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">${item.price.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex items-center space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button 
            type="button"
            onClick={() => onEdit(item)} 
            className="text-stone-400 hover:text-orange-600 dark:text-stone-500 dark:hover:text-orange-500 p-2 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors btn-press"
        >
            <Edit2 size={16} />
        </button>
        <button 
            type="button"
            onClick={() => onDelete(item.id)} 
            className="text-stone-400 hover:text-red-500 dark:text-stone-500 dark:hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors btn-press"
        >
            <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
