import { ArrowUpRight } from 'lucide-react';

const collections = [
  {
    title: 'Urban Essentials',
    desc: 'Daily staples reimagined.',
    image:
      'https://images.pexels.com/photos/2059928/pexels-photo-2059928.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Cold Season',
    desc: 'Built for the freeze.',
    image:
      'https://images.pexels.com/photos/35846504/pexels-photo-35846504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Street Footwear',
    desc: 'Step up your game.',
    image:
      'https://images.pexels.com/photos/11324527/pexels-photo-11324527.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export default function Collections() {
  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="collections" className="py-16 md:py-24 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-neutral-400 uppercase mb-3">
              Curated
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-950">
              Collections
            </h2>
          </div>
          <button
            onClick={scrollToShop}
            className="text-sm font-bold text-neutral-950 hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            View All Products
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {collections.map((col) => (
            <button
              key={col.title}
              onClick={scrollToShop}
              className="group relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden text-left"
            >
              <img
                src={col.image}
                alt={col.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                  {col.title}
                </h3>
                <p className="text-sm text-neutral-200 mb-3">{col.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white uppercase tracking-wider group-hover:gap-2 transition-all">
                  Shop Now <ArrowUpRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
