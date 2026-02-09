import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicMenuService, type PublicMenuData } from '../services/public-menu.service';
import { MenuTemplateSelector } from '../components/MenuTemplateSelector';
import { Search } from 'lucide-react'; 

export default function PublicMenu() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<PublicMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (slug) loadMenu();
  }, [slug]);

  const loadMenu = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const menuData = await publicMenuService.getMenuBySlug(slug);
      setData(menuData);
    } catch (err) {
      setError('Failed to load menu. It might not exist.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  );
  
  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col p-4">
        <p className="text-red-500 font-medium">{error || 'Menu not found'}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-stone-500 underline text-sm">Retry</button>
    </div>
  );

  const { business, categories } = data;
  const nonEmptyCategories = categories.filter(c => c.items && c.items.length > 0);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
         window.scrollTo({ top: 0, behavior: 'smooth' });
         return;
    }
    const el = document.getElementById(`category-${catId}`);
    if (el) {
        // Offset for sticky header
        const y = el.getBoundingClientRect().top + window.scrollY - 180;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <div className="light min-h-screen bg-white pb-20 text-stone-900">
      {/* Top Navigation / Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    {business.logo_url ? (
                        <img src={business.logo_url} alt={business.name} className="h-10 w-10 rounded-full object-cover shadow-sm" />
                    ) : (
                         <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                            {business.name.charAt(0)}
                         </div>
                    )}
                    <h1 className="text-xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">{business.name}</h1>
                </div>

                {/* Right Actions (Mock) */}
                <div className="flex items-center gap-4 text-gray-400">
                     <Search size={20} className="hover:text-gray-600 cursor-pointer" />
                </div>
            </div>
            
            {/* Category Navigation (Scrollable) */}
            <div className="py-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-2 min-w-max">
                    <button 
                        onClick={() => scrollToCategory('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                            activeCategory === 'all' 
                            ? 'bg-stone-900 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All Menu
                    </button>
                    {nonEmptyCategories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => scrollToCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                activeCategory === cat.id 
                                ? 'bg-stone-900 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </header>

      {/* Hero / Banner Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative rounded-2xl overflow-hidden bg-stone-900 h-48 sm:h-64 flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900 to-stone-900 opacity-90"></div>
            <div className="relative z-10 px-6 max-w-2xl">
                 <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                    {business.name}
                 </h2>
                 {business.description && (
                    <p className="text-orange-100 text-lg sm:text-lg opacity-90">
                        {business.description}
                    </p>
                 )}
            </div>
        </div>
      </div>

      {/* Dynamic Menu Template */}
      <MenuTemplateSelector data={data} />
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Brand & Description */}
                <div>
                     <h3 className="text-lg font-bold text-gray-900 mb-2">{business.name}</h3>
                     {business.description && (
                        <p className="text-gray-500 text-sm">{business.description}</p>
                     )}
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Contact</h4>
                    <div className="space-y-3 text-sm text-gray-500">
                        {business.address && (
                            <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-900">Address:</span> 
                                {business.address}
                            </div>
                        )}
                        {business.contact_phone && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">Phone:</span> 
                                <a href={`tel:${business.contact_phone}`} className="hover:text-orange-600 transition-colors">
                                    {business.contact_phone}
                                </a>
                            </div>
                        )}
                        {business.contact_email && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">Email:</span> 
                                <a href={`mailto:${business.contact_email}`} className="hover:text-orange-600 transition-colors">
                                    {business.contact_email}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Opening Hours & Social */}
                <div>
                     {business.opening_hours && Object.keys(business.opening_hours).length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Opening Hours</h4>
                            {/* Basic placeholder for now as structure is generic JSON */}
                            <p className="text-sm text-gray-500">Check our social media for daily updates.</p>
                        </div>
                     )}
                     
                     {business.social_links && Object.keys(business.social_links).length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                {business.social_links.facebook && (
                                    <a href={ensureAbsoluteUrl(business.social_links.facebook)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                        Facebook
                                    </a>
                                )}
                                {business.social_links.instagram && (
                                    <a href={ensureAbsoluteUrl(business.social_links.instagram)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                                        Instagram
                                    </a>
                                )}
                                {business.social_links.twitter && (
                                    <a href={ensureAbsoluteUrl(business.social_links.twitter)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                        Twitter
                                    </a>
                                )}
                                {business.website_url && (
                                    <a href={ensureAbsoluteUrl(business.website_url)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stone-900 transition-colors">
                                        Website
                                    </a>
                                )}
                            </div>
                        </div>
                     )}
                </div>
            </div>
            
            <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
                <p>&copy; {new Date().getFullYear()} {business.name}. Powered by Menux.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
