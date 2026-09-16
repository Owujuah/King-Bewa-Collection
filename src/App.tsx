import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Collections from '@/components/Collections';
import About from '@/components/About';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutPage from '@/components/CheckoutPage';
import ProductDetail from '@/components/ProductDetail';
import AdminPage from '@/components/AdminPage';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { CheckCircle2, Settings } from 'lucide-react';
import type { Product } from '@/types';

type View = 'store' | 'checkout' | 'admin';

export default function App() {
  const cart = useCart();
  const { products, loading } = useProducts();
  const [view, setView] = useState<View>('store');
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const goToCheckout = () => {
    cart.setIsOpen(false);
    setView('checkout');
  };

  const goBack = () => setView('store');

  const handlePlaceOrder = () => {
    cart.clearCart();
    setView('store');
    setCheckoutDone(true);
    setTimeout(() => setCheckoutDone(false), 3500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={cart.totalItems}
        onCartClick={() => cart.setIsOpen(true)}
      />

      {/* Admin button - floating */}
      {view === 'store' && (
        <button
          onClick={() => setView('admin')}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-lg hover:bg-neutral-800 transition-colors hover:scale-105 active:scale-95"
          aria-label="Admin panel"
        >
          <Settings size={20} />
        </button>
      )}

      {view === 'store' ? (
        <>
          <Hero />
          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-950 rounded-full animate-spin" />
            </div>
          ) : (
            <ProductGrid
              products={products}
              onAddToCart={cart.addToCart}
              onProductClick={setSelectedProduct}
            />
          )}
          <Collections />
          <About />
          <Footer />
        </>
      ) : view === 'checkout' ? (
        <CheckoutPage
          items={cart.items}
          totalPrice={cart.totalPrice}
          onBack={goBack}
          onPlaceOrder={handlePlaceOrder}
        />
      ) : (
        <AdminPage onBack={goBack} />
      )}

      <CartDrawer
        isOpen={cart.isOpen}
        onClose={() => cart.setIsOpen(false)}
        items={cart.items}
        totalPrice={cart.totalPrice}
        onRemove={cart.removeFromCart}
        onUpdateQty={cart.updateQuantity}
        onCheckout={goToCheckout}
      />

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={cart.addToCart}
        />
      )}

      {checkoutDone && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-neutral-950 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-[slideUp_0.3s_ease-out]">
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="font-bold text-sm">Order placed! Thank you.</span>
        </div>
      )}
    </div>
  );
}
