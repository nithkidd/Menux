import type { PublicMenuData } from '../../services/public-menu.service';

interface DefaultListTemplateProps {
  data: PublicMenuData;
}

export function DefaultListTemplate({ data }: DefaultListTemplateProps) {
  const { categories } = data;
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-12">
        {categories.map(category => (
            <div key={category.id} id={`category-${category.id}`} className="scroll-mt-48">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">{category.name}</h2>
                <div className="grid gap-6 sm:grid-cols-1">
                    {category.items?.map(item => (
                        <div key={item.id} className="flex space-x-4 py-4 border-b border-gray-100 last:border-0">
                            {item.image_url && (
                                <div className="flex-shrink-0">
                                    <img className="h-24 w-24 rounded-lg object-cover bg-gray-100" src={item.image_url} alt={item.name} />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-lg font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                            </div>
                        </div>
                    ))}
                    {(!category.items || category.items.length === 0) && (
                        <p className="text-gray-400 italic">No items in this category.</p>
                    )}
                </div>
            </div>
        ))}

        {categories.length === 0 && (
            <div className="text-center py-20">
                <p className="text-gray-500">Menu is empty.</p>
            </div>
        )}
    </div>
  );
}
