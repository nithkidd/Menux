import { useState, useEffect, useCallback } from 'react';
import * as adminService from '../services/admin.service';
import type { AdminBusiness } from '../services/admin.service';
import { Search, Loader2, Store, Trash2, Power, PowerOff, ExternalLink } from 'lucide-react';


export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminService
      .fetchBusinesses()
      .then(setBusinesses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      await adminService.toggleBusinessActive(id, !currentActive);
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, is_active: !currentActive } : b,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to toggle business status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete business "${name}"? This cannot be undone.`)) return;
    try {
      await adminService.deleteBusiness(id);
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete business");
    }
  };

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.owner_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Businesses</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage registered restaurants and menus.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none w-full sm:w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <span className="ml-2 text-stone-500">Loading businesses...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100 dark:divide-stone-800">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredBusinesses.map((biz) => (
                  <tr key={biz.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-500">
                          <Store size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-stone-900 dark:text-white">{biz.name}</div>
                          <div className="text-sm text-stone-500 flex items-center gap-1">
                            <span className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-xs">/{biz.slug}</span>
                            <a href={`/menu/${biz.slug}`} target="_blank" rel="noopener noreferrer" className="hover:text-orange-600">
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900 dark:text-stone-200">{biz.owner_name || 'Unknown'}</div>
                      <div className="text-xs text-stone-500">{biz.owner_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        biz.is_active 
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' 
                          : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                      }`}>
                        {biz.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {new Date(biz.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(biz.id, biz.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            biz.is_active 
                              ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                              : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                          }`}
                          title={biz.is_active ? "Deactivate" : "Activate"}
                        >
                          {biz.is_active ? <Power size={18} /> : <PowerOff size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(biz.id, biz.name)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Business"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredBusinesses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-stone-500 dark:text-stone-400">
                      No businesses found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
