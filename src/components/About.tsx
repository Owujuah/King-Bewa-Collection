export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-neutral-950 text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500 uppercase mb-4">
          Our Story
        </p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
          Born in the streets.
          <br />
          <span className="text-neutral-400 italic font-light">
            Made for everyone.
          </span>
        </h2>
        <p className="text-base md:text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto mb-10">
          KBC started with a simple idea: clothing should feel as good as it
          looks. We source premium fabrics, partner with ethical factories, and
          design every piece to outlast trends. No fast fashion. No shortcuts.
          Just garments you'll reach for again and again.
        </p>
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          <div>
            <p className="text-3xl md:text-4xl font-black">50K+</p>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              Happy Customers
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black">120+</p>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              Unique Designs
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black">100%</p>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              Ethically Sourced
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
