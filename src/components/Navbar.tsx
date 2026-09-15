import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ArrowRight, Globe } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const links = ['Home', 'Shop', 'Collections', 'About'];

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <button
            onClick={() => scrollTo('home')}
            className="font-black text-2xl md:text-3xl tracking-tighter text-white"
          >
            KBC
          </button>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link}
                onClick={() =>
                  scrollTo(
                    link === 'Home'
                      ? 'home'
                      : link === 'Shop'
                        ? 'shop'
                        : link === 'Collections'
                          ? 'collections'
                          : 'about'
                  )
                }
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCartClick}
              className="relative text-white p-1 hover:text-neutral-300 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-neutral-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-[pop_0.2s_ease-out]">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 top-0 bg-black/60 z-30 animate-[fadeUp_0.2s_ease-out]"
              onClick={() => setMobileOpen(false)}
            />
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-neutral-950 overflow-hidden animate-[slideDown_0.35s_cubic-bezier(0.16,1,0.3,1)]">
              <div className="flex items-center justify-between h-16 px-5">
                <span className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-neutral-700 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-5 pb-2">
                {links.map((link, i) => (
                  <button
                    key={link}
                    onClick={() =>
                      scrollTo(
                        link === 'Home'
                          ? 'home'
                          : link === 'Shop'
                            ? 'shop'
                            : link === 'Collections'
                              ? 'collections'
                              : 'about'
                      )
                    }
                    className="group flex items-center justify-between w-full py-4 border-b border-neutral-800/60"
                    style={{ animation: `fadeUp 0.4s ease-out ${0.08 + i * 0.07}s both` }}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs font-bold text-neutral-600 tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="text-2xl font-black text-white group-hover:text-neutral-400 transition-colors">
                        {link}
                      </span>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
              </div>

              <div className="px-5 py-5 mt-2 bg-gradient-to-r from-neutral-900 to-neutral-950 border-t border-neutral-800/50">
                <div className="flex items-center gap-2.5 text-neutral-300">
                  <Globe size={16} className="text-green-400" />
                  <span className="text-sm font-medium">
                    International shipping available worldwide
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
