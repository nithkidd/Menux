import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  subValue?: string;
  subLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string; // e.g. "text-blue-600"
  bgClass?: string; // e.g. "bg-blue-50"
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  subValue,
  subLabel,
  trend,
  color = "text-stone-900 dark:text-white",
  bgClass = "bg-stone-50 dark:bg-stone-800"
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/50 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${color}`}>
              {value}
            </span>
            {subValue && (
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600 dark:text-green-500' : 
                trend === 'down' ? 'text-red-600 dark:text-red-500' : 'text-stone-500 dark:text-stone-400'
              }`}>
                {subValue}
              </span>
            )}
          </div>
          {subLabel && (
            <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">{subLabel}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${bgClass}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        )}
      </div>
    </div>
  );
}
