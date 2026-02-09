
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { menuService, type Category, type Item } from '../services/menu.service';
import { foodTypeService } from '../services/food-type.service';
import { businessService, type Business } from '../../business/services/business.service';
import { Plus, ExternalLink, PlayCircle } from 'lucide-react'; 
import PageTransition from '../../../shared/components/PageTransition'; 
import ItemModal from '../components/ItemModal';
import CategoryModal from '../components/CategoryModal';

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  type DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { SortableCategory } from '../components/SortableCategory';

export default function MenuEditor() {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (businessId) {
      loadMenu();
      loadBusiness();
    }
  }, [businessId]);

  const loadBusiness = async () => {
    if (!businessId) return;
    try {
      const data = await businessService.getById(businessId);
      setBusiness(data);
    } catch (error) {
      console.error('Failed to load business', error);
    }
  };

  const loadMenu = async () => {
    if (!businessId) return;
    try {
      setLoading(true);
      const data = await menuService.getCategories(businessId);
      setCategories(data);
    } catch (error) {
      console.error('Failed to load menu', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Check if dragging a category
    const activeCategoryIndex = categories.findIndex(cat => cat.id === active.id);
    const overCategoryIndex = categories.findIndex(cat => cat.id === over.id);

    if (activeCategoryIndex !== -1 && overCategoryIndex !== -1) {
        // Reordering categories
        const newCategories = arrayMove(categories, activeCategoryIndex, overCategoryIndex);
        setCategories(newCategories); // Optimistic update
        
        // Prepare API payload
        const reorderPayload = newCategories.map((cat, index) => ({
            id: cat.id,
            sort_order: index
        }));

        try {
            await menuService.reorderCategories(reorderPayload);
        } catch (error) {
            console.error("Failed to reorder categories", error);
            loadMenu(); // Revert on error
        }
        return;
    }

    // Check if dragging an item
    // Find source category and item
    let sourceCategory: Category | undefined;
    let sourceItem: Item | undefined;

    for (const cat of categories) {
        const item = cat.items?.find(i => i.id === active.id);
        if (item) {
            sourceCategory = cat;
            sourceItem = item;
            break;
        }
    }

    if (sourceCategory && sourceItem) {
        // Find target item (over)
        // Since we only support reordering WITHIN a category for now (simplification), 
        // verify over is in the same category
        const isOverInSameCategory = sourceCategory.items.some(i => i.id === over.id);

        if (isOverInSameCategory) {
            const oldIndex = sourceCategory.items.findIndex(i => i.id === active.id);
            const newIndex = sourceCategory.items.findIndex(i => i.id === over.id);

            const newItems = arrayMove(sourceCategory.items, oldIndex, newIndex);
            
            // Update local state
            const newCategories = categories.map(cat => {
                if (cat.id === sourceCategory!.id) {
                    return { ...cat, items: newItems };
                }
                return cat;
            });
            setCategories(newCategories);

             // Prepare API payload
             const reorderPayload = newItems.map((item, index) => ({
                id: item.id,
                sort_order: index
            }));

            try {
                await menuService.reorderItems(sourceCategory.id, reorderPayload);
            } catch (error) {
                console.error("Failed to reorder items", error);
                loadMenu(); // Revert
            }
        }
    }
  };

  const handleSaveCategory = async (name: string) => {
    if (!businessId) return;
    try {
      if (editingCategory) {
        await menuService.updateCategory(editingCategory.id, name);
      } else {
        await menuService.createCategory(businessId, name);
      }
      setIsCategoryModalOpen(false);
      loadMenu();
    } catch (error) {
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete category?')) return;
    try {
      await menuService.deleteCategory(id);
      loadMenu();
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  // Open modal for Create Item
  const openCreateModal = (categoryId: string) => {
    setEditingItem(null); // Create mode
    setTargetCategoryId(categoryId);
    setIsModalOpen(true);
  };

  // Open modal for Edit Item
  const openEditModal = (item: Item) => {
    setEditingItem(item); // Edit mode
    setTargetCategoryId(item.category_id);
    setIsModalOpen(true);
  };

  // Handle Save from Item Modal
  const handleSaveItem = async (formData: Partial<Item>, foodTypeIds: string[]) => {
    try {
        let savedItem: Item;
        if (editingItem) {
            // Update
            savedItem = await menuService.updateItem(editingItem.id, formData);
        } else {
            // Create
            if (!formData.category_id) return;
            savedItem = await menuService.createItem(formData.category_id, formData);
        }

        // Save tags
        if (foodTypeIds) {
            await foodTypeService.setItemTags(savedItem.id, foodTypeIds);
        }

        setIsModalOpen(false);
        loadMenu();
    } catch (error) {
        console.error("Failed to save item", error);
        alert('Failed to save item');
    }
  };

  const handleDeleteItem = async (id: string) => {
     if (!confirm('Delete item?')) return;
     try {
       await menuService.deleteItem(id);
       loadMenu();
     } catch (error) {
       alert('Failed to delete item');
     }
  };

  if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading menu...</div>;

  return (
    <PageTransition className="pb-20">
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors btn-press">← Back</Link>
                <h1 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">Menu Editor: {business?.name}</h1>
            </div>
            {business && (
              <a 
                href={`/menu/${business.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white transition-all border border-stone-200 dark:border-stone-700 shadow-sm btn-press"
              >
                  <PlayCircle size={18} className="mr-2 text-orange-600 dark:text-orange-500" />
                  <span>Live Preview</span>
                  <ExternalLink size={14} className="ml-2 text-stone-400" />
              </a>
            )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Actions Bar */}
        <div className="flex justify-end mb-8">
            <button
                onClick={() => {
                    setEditingCategory(null);
                    setIsCategoryModalOpen(true);
                }}
                className="inline-flex items-center rounded-xl border border-transparent bg-stone-900 dark:bg-orange-600 px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-stone-800 dark:hover:bg-orange-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all btn-press"
            >
                <Plus size={20} className="mr-2"/> Add Category
            </button>
        </div>

        {/* Draggable Categories List */}
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={categories.map(cat => cat.id)} 
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-6">
                    {categories.map(category => (
                        <SortableCategory
                            key={category.id}
                            category={category}
                            items={category.items || []}
                            onDeleteCategory={handleDeleteCategory}
                            onEditItem={openEditModal}
                            onDeleteItem={handleDeleteItem}
                            onAddItem={openCreateModal}
                            onEditCategory={(cat) => {
                                setEditingCategory(cat);
                                setIsCategoryModalOpen(true);
                            }}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
            
        {categories.length === 0 && (
            <div className="text-center py-12 text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 border-dashed">
                No categories yet. Click "Add Category" to get started.
            </div>
        )}

        {/* Modal */}
        {businessId && (
            <ItemModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveItem}
                initialData={editingItem}
                categories={categories}
                initialCategoryId={targetCategoryId}
                businessId={businessId}
            />
        )}

        {/* Category Modal */}
        <CategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            onSave={handleSaveCategory}
            initialName={editingCategory?.name}
        />

      </div>
    </PageTransition>
  );
}
