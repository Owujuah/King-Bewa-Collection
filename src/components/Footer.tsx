import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-black text-2xl text-white mb-3">KBC</h3>
            <p className="text-sm leading-relaxed">
              Premium streetwear designed in the city, built for the streets.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Best Sellers
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Sale
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="hover:text-white transition-colors">
                  Shipping
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Returns
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">
              Follow
            </h4>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-white hover:text-neutral-950 transition-all"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800 pt-6 text-center text-xs">
          <p>&copy; 2026 KBC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
