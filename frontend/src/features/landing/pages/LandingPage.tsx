import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, Smartphone, Menu, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageTransition from '../../../shared/components/PageTransition';

// Navbar and Footer are now in shared/components and rendered by MainLayout

const Hero = () => (
  // Added negative margin top to compensate for MainLayout padding if needed, 
  // currently MainLayout adds pt-16 (64px). 
  // Landing page hero originally had pt-32 (128px), so we keep some padding but maybe less.
  <section className="pt-16 pb-16 md:pt-32 md:pb-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6 tracking-wide">
          HEADLESS MENU MANAGEMENT
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-white tracking-tight mb-8 leading-tight">
          The Modern Way to <br className="hidden md:block" />
          <span className="text-orange-600">Display Your Menu.</span>
        </h1>
        <p className="text-xl text-stone-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Replace PDF menus with stunning, mobile-first digital experiences. 
          Update prices instantly, track views, and never print a QR code twice.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard/create-business"
            className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-orange-200 flex items-center justify-center gap-2 btn-press"
          >
            Create Menu Free <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-stone-200 text-stone-700 hover:border-orange-200 hover:text-orange-600 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 btn-press">
            View Live Demo
          </button>
        </div>
      </div>

      {/* 3D Mockup Placeholder */}
      <div className="relative mx-auto mt-16 max-w-5xl">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50 to-transparent z-10 h-24 bottom-0 w-full" />
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-stone-900 bg-stone-800 aspect-[16/9] md:aspect-[21/9] transform rotate-1 hover:rotate-0 transition-all duration-700 ease-out">
            <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                <div className="text-center">
                    <Smartphone className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-400 font-medium">Interactive Menu Preview</p>
                </div>
            </div>
             {/* Simulated Screen Content - could be an image or iframe later */}
             <div className="absolute top-0 left-0 w-full h-12 bg-stone-900 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"/>
                <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                <div className="w-3 h-3 rounded-full bg-green-500"/>
             </div>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section id="features" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight">Everything you need to grow</h2>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Built for speed and simplicity. No coding required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Zap className="w-6 h-6 text-orange-600" />,
            title: "Instant Updates",
            desc: "Change prices, hide sold-out items, and update descriptions in seconds. No reprints needed."
          },
          {
            icon: <ShieldCheck className="w-6 h-6 text-orange-600" />,
            title: "QR Code Generator",
            desc: "Download high-quality QR codes for your tables. One scan connects customers to your digital menu."
          },
            {
            icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
            title: "Smart Analytics",
            desc: "Track which categories are most popular and optimize your menu for higher conversion."
          }
        ].map((feature, idx) => (
          <div key={idx} className="p-8 rounded-3xl border border-stone-100 bg-stone-50 hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
            <p className="text-stone-500 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DemoSection = () => (
    <section className="py-24 bg-stone-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-orange-500 font-bold tracking-wider text-sm uppercase mb-2 block">Live Preview</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">See it in action.</h2>
                    <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                        Experience the difference between a static PDF and a dynamic MenuX Digital Menu.
                        Your customers get a seamless, app-like experience without downloading anything.
                    </p>
                    
                    <ul className="space-y-4 mb-8">
                        {['Mobile optimized', 'Search & Filter', 'Category Navigation'].map((item, i) => (
                            <li key={i} className="flex items-center space-x-3 text-stone-300">
                                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <Link to="/menu/demo-restaurant" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition-colors">
                        Try the demo menu <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
                <div className="relative">
                     {/* Abstract representation of "Editor" vs "Customer" view */}
                    <div className="relative z-10 bg-white rounded-3xl p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="bg-stone-100 rounded-2xl overflow-hidden aspect-[9/16] relative border-4 border-stone-200">
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300">
                                 <Menu className="w-12 h-12 mb-2" />
                                 <span className="font-mono text-xs">CUSTOMER VIEW</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
)


export default function LandingPage() {
  return (
    <PageTransition>
      <Hero />
      <Features />
      <DemoSection />
    </PageTransition>
  );
}
