import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/29538558/pexels-photo-29538558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="KBC streetwear model"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/40 to-neutral-950" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl pt-20 md:pt-24">
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] text-neutral-400 uppercase mb-4 md:mb-6 animate-[fadeUp_0.6s_ease-out]">
          Fall / Winter 2026
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.9] mb-6 md:mb-8 animate-[fadeUp_0.7s_ease-out_0.1s_both]">
          WEAR
          <br />
          YOUR
          <br />
          <span className="text-white/90 italic font-light">attitude</span>
        </h1>
        <p className="text-base md:text-lg text-neutral-300 max-w-xl mx-auto mb-8 md:mb-10 animate-[fadeUp_0.7s_ease-out_0.2s_both]">
          Premium streetwear designed in the city, built for the streets. Bold
          silhouettes, honest materials, zero compromise.
        </p>
        <button
          onClick={scrollToShop}
          className="group inline-flex items-center gap-2 bg-white text-neutral-950 px-8 py-3.5 md:px-10 md:py-4 text-sm font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all duration-300 animate-[fadeUp_0.7s_ease-out_0.3s_both]"
        >
          Shop Collection
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-[bounce_2s_ease-in-out_infinite]">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
