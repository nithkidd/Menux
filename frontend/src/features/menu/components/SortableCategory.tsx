import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, Edit2 } from 'lucide-react';
import type { Category, Item } from '../services/menu.service';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

interface SortableCategoryProps {
  category: Category;
  items: Item[];
  onDeleteCategory: (id: string) => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (categoryId: string) => void;
  onEditCategory: (category: Category) => void;
}

export function SortableCategory({
  category,
  items,
  onDeleteCategory,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onEditCategory
}: SortableCategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden mb-6 ${isDragging ? 'z-40 shadow-xl' : ''}`}
    >
        {/* Category Header with Drag Handle */}
        <div className="bg-stone-50 dark:bg-stone-800/50 px-4 pl-2 py-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
                 <div 
                    {...attributes} 
                    {...listeners}
                    className="text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400 cursor-grab active:cursor-grabbing p-2 touch-none"
                >
                    <GripVertical size={20} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">{category.name}</h3>
            </div>
            <div className="flex items-center gap-1">
                <button 
                    type="button"
                    onClick={() => onEditCategory(category)} 
                    className="text-stone-300 hover:text-orange-600 dark:text-stone-600 dark:hover:text-orange-500 transition-colors btn-press p-2"
                >
                    <Edit2 size={18} />
                </button>
                <button 
                    type="button"
                    onClick={() => onDeleteCategory(category.id)} 
                    className="text-stone-300 hover:text-red-500 dark:text-stone-600 dark:hover:text-red-500 transition-colors btn-press p-2"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
        
        <div className="p-6 space-y-4">
            <SortableContext 
                items={items.map(item => item.id)} 
                strategy={verticalListSortingStrategy}
            >
                {items.map(item => (
                    <SortableItem 
                        key={item.id} 
                        item={item} 
                        onEdit={onEditItem} 
                        onDelete={onDeleteItem} 
                    />
                ))}
            </SortableContext>
            
            <button 
                type="button"
                onClick={() => onAddItem(category.id)}
                className="mt-2 w-full flex items-center justify-center p-3 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl text-stone-400 dark:text-stone-500 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition-all btn-press"
            >
                <Plus size={16} className="mr-1" /> Add New Item
            </button>
        </div>
    </div>
  );
}
