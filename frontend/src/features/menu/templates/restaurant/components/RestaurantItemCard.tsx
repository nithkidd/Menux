import { Leaf, Flame, Image as ImageIcon } from 'lucide-react';
import type { Item } from '../../../services/menu.service';

interface RestaurantItemCardProps {
  item: Item;
}

export function RestaurantItemCard({ item }: RestaurantItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <ImageIcon size={32} />
          </div>
        )}
        
        {/* Badges/Tags overlay */}
        <div className="absolute top-2 right-2 flex gap-1">
          {item.is_vegetarian && (
            <div className="bg-green-100 text-green-700 p-1.5 rounded-full shadow-sm" title="Vegetarian">
              <Leaf size={14} fill="currentColor" />
            </div>
          )}
          {item.is_spicy && (
            <div className="bg-red-100 text-red-700 p-1.5 rounded-full shadow-sm" title="Spicy">
              <Flame size={14} fill="currentColor" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-stone-900 line-clamp-2 leading-tight">{item.name}</h3>
            <span 
                className="font-bold px-2 py-1 rounded-lg text-sm whitespace-nowrap ml-2 bg-stone-100"
                style={{ color: 'var(--primary)' }}
            >
                ${item.price.toFixed(2)}
            </span>
        </div>
        
        {item.description && (
            <p className="text-stone-500 text-sm line-clamp-3 mb-4 flex-1">
                {item.description}
            </p>
        )}

        {/* Footer/Action Area */}
        {!item.is_available && (
            <div className="mt-auto pt-3 border-t border-stone-100">
                <span className="text-xs font-medium bg-stone-100 text-stone-500 px-2 py-1 rounded-md">
                    Sold Out
                </span>
            </div>
        )}
      </div>
    </div>
  );
}
