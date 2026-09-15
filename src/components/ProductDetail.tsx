import { useState, useEffect } from 'react';
import { X, Plus, Check, ChevronLeft, ChevronRight, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import type { Product } from '@/types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
}

export default function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const prevImage = () =>
    setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  const nextImage = () =>
    setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-neutral-950/80 backdrop-blur-sm animate-[fadeUp_0.2s_ease-out]">
      <div
        className="min-h-full flex items-start justify-center p-0 md:p-6"
        onClick={onClose}
      >
        <div
          className="relative bg-white w-full max-w-5xl md:rounded-2xl overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors shadow-md"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery */}
            <div className="relative bg-neutral-100">
              <div className="relative aspect-[4/5] md:aspect-auto md:h-full overflow-hidden">
                <img
                  src={product.images[activeImage]}
                  alt={`${product.name} - image ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors shadow-md"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors shadow-md"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Thumbnails */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? 'border-neutral-950 scale-105'
                        : 'border-white/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col p-6 md:p-8 overflow-y-auto max-h-[90vh] md:max-h-[85vh]">
              <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-2">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-950 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-black text-neutral-950 mb-4">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-neutral-950 mb-3">
                  Product Details
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check size={16} className="text-neutral-950 flex-shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-neutral-950 mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-sm font-semibold px-4 py-2.5 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2 bg-neutral-950 text-white text-sm font-bold py-4 rounded-lg hover:bg-neutral-800 transition-all duration-200 active:scale-[0.98] mb-6"
              >
                {added ? (
                  <>
                    <Check size={18} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add to Cart - ${product.price.toFixed(2)}
                  </>
                )}
              </button>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-100">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Truck size={20} className="text-neutral-700" />
                  <span className="text-[11px] font-medium text-neutral-500">
                    Free shipping over $100
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <RotateCcw size={20} className="text-neutral-700" />
                  <span className="text-[11px] font-medium text-neutral-500">
                    30-day returns
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <ShieldCheck size={20} className="text-neutral-700" />
                  <span className="text-[11px] font-medium text-neutral-500">
                    Secure checkout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
