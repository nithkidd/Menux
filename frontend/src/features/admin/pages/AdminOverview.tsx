import { useEffect, useState } from 'react';
import * as adminService from '../services/admin.service';
import type { DashboardStats } from '../services/admin.service';
import { StatsCard } from '../components/StatsCard';
import { Users, Building2, Utensils, ListFilter, Activity } from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .fetchStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-stone-100 dark:bg-stone-800 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 text-red-600 p-4 rounded-xl">
        Failed to load statistics.
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Platform activity and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-600"
          bgClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatsCard
          label="Total Businesses"
          value={stats.totalBusinesses}
          icon={Building2}
          color="text-green-600"
          bgClass="bg-green-50 dark:bg-green-900/20"
        />
        <StatsCard
          label="Active Businesses"
          value={stats.activeBusinesses}
          icon={Activity}
          color="text-emerald-600"
          bgClass="bg-emerald-50 dark:bg-emerald-900/20"
          subValue={Math.round((stats.activeBusinesses / stats.totalBusinesses) * 100) + '%'}
          subLabel="Activation Rate"
        />
        <StatsCard
          label="Total Categories"
          value={stats.totalCategories}
          icon={ListFilter}
          color="text-purple-600"
          bgClass="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatsCard
          label="Total Items"
          value={stats.totalItems}
          icon={Utensils}
          color="text-orange-600"
          bgClass="bg-orange-50 dark:bg-orange-900/20"
        />
      </div>
    </>
  );
}
