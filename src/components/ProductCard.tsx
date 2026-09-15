import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group relative bg-neutral-50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-neutral-900/10">
      <button
        onClick={() => onProductClick(product)}
        className="block w-full text-left"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {product.category}
          </span>
          <span className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/10 transition-colors duration-300" />
        </div>
      </button>

      <div className="p-4 md:p-5">
        <button
          onClick={() => onProductClick(product)}
          className="block w-full text-left"
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-sm md:text-base text-neutral-950 leading-tight hover:text-neutral-600 transition-colors">
              {product.name}
            </h3>
            <span className="font-black text-sm md:text-base text-neutral-950 whitespace-nowrap">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
            {product.description}
          </p>
        </button>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                selectedSize === size
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-1.5 bg-neutral-950 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-neutral-800 transition-all duration-200 active:scale-[0.98]"
        >
          {added ? (
            <>
              <Check size={16} />
              Added
            </>
          ) : (
            <>
              <Plus size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
