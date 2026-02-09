import { LayoutDashboard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-stone-900 py-12 border-t border-stone-100 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                 <LayoutDashboard className="h-6 w-6 text-stone-900 dark:text-white" />
                 <span className="text-lg font-bold text-stone-900 dark:text-white">MenuX</span>
            </div>
            <div className="flex space-x-6 text-stone-500 dark:text-stone-400 text-sm">
                <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">Contact</a>
            </div>
            <div className="mt-4 md:mt-0 text-stone-400 dark:text-stone-500 text-sm">
                &copy; {new Date().getFullYear()} MenuX. All rights reserved.
            </div>
        </div>
    </footer>
  );
}
