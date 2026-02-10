
import { useEffect, useState } from 'react';

import { businessService, type Business } from '../services/business.service';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import PageTransition from '../../../shared/components/PageTransition';

export default function Dashboard() {
  // const { user, signOut } = useAuth(); // Not needed as Navbar handles it
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      // Admin might have global access, but on dashboard we only want to see THEIR businesses
      const data = await businessService.getAll({ scope: 'own' });
      setBusinesses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
            {/* ... content ... */}
            <div className="min-w-0 flex-1">
                <h2 className="text-3xl font-bold leading-7 text-stone-900 dark:text-white sm:truncate tracking-tight">
                Your Businesses
                </h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Manage your restaurant menus and settings.</p>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
                <Link
                    to="/dashboard/create-business"
                    className="inline-flex items-center rounded-2xl bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-700 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 btn-press"
                >
                    Create Business
                </Link>
            </div>
        </div>

        {loading ? (
                <div className="text-center py-24">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]" >Loading...</span>
                    </div>
                </div>
        ) : error ? (
                <div className="text-center py-12 text-red-600 bg-red-50 dark:bg-red-900/10 rounded-2xl">{error}</div>
        ) : businesses.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800">
                    <div className="mx-auto h-12 w-12 text-stone-400">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-stone-900 dark:text-white">No businesses</h3>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Get started by creating a new business.</p>
                    <div className="mt-6">
                        <Link
                            to="/dashboard/create-business"
                            className="inline-flex items-center rounded-2xl bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 btn-press"
                        >
                            Create Business
                        </Link>
                    </div>
                </div>
        ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {businesses.map((biz) => (
                <div 
                    key={biz.id} 
                    className="group relative flex flex-col justify-between space-y-4 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900 transition-all duration-300"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                <Link to={`/dashboard/business/${biz.id}`}>
                                    {biz.name}
                                </Link>
                            </h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{biz.business_type}</p>
                        </div>
                        {biz.logo_url && (
                            <img src={biz.logo_url} alt={biz.name} className="h-12 w-12 rounded-xl object-cover bg-stone-100 dark:bg-stone-800" />
                        )}
                    </div>
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
                        <Link 
                            to={`/dashboard/business/${biz.id}`}
                            className="inline-flex items-center text-sm font-bold text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 transition-colors"
                        >
                            Edit Menu
                        </Link>
                        <Link 
                            to={`/dashboard/business/${biz.id}/settings`}
                            className="inline-flex items-center text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 transition-colors gap-1"
                        >
                            <Settings size={16} />
                            Manage
                        </Link>
                    </div>
                </div>
                ))}
            </div>
        )}
      </div>
    </PageTransition>
  );
}
