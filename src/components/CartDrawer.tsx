import { useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onRemove: (id: number, size: string) => void;
  onUpdateQty: (id: number, size: string, delta: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  totalPrice,
  onRemove,
  onUpdateQty,
  onCheckout,
}: CartDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white z-[70] shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-black text-lg text-neutral-950 flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
            <span className="text-sm font-normal text-neutral-400">
              ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-950 transition-colors"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-neutral-300" />
            </div>
            <p className="font-bold text-neutral-950 mb-1">Your cart is empty</p>
            <p className="text-sm text-neutral-500 mb-6">
              Add some pieces to get started.
            </p>
            <button
              onClick={onClose}
              className="bg-neutral-950 text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-bold text-sm text-neutral-950 truncate">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => onRemove(item.id, item.selectedSize)}
                        className="text-neutral-300 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">
                      Size: {item.selectedSize}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-neutral-200 rounded-lg">
                        <button
                          onClick={() =>
                            onUpdateQty(item.id, item.selectedSize, -1)
                          }
                          className="p-1.5 text-neutral-500 hover:text-neutral-950 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-bold text-neutral-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQty(item.id, item.selectedSize, 1)
                          }
                          className="p-1.5 text-neutral-500 hover:text-neutral-950 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-black text-sm text-neutral-950">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 px-5 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-neutral-950">Total</span>
                <span className="font-black text-xl text-neutral-950">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Shipping & taxes calculated at checkout.
              </p>
              <button
                onClick={onCheckout}
                className="w-full bg-neutral-950 text-white text-sm font-bold py-3.5 rounded-lg hover:bg-neutral-800 transition-colors active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
