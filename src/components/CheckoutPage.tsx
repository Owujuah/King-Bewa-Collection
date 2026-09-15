import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Lock,
  CreditCard,
  Tag,
  Check,
  X,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import type { CartItem } from '@/types';

interface CheckoutPageProps {
  items: CartItem[];
  totalPrice: number;
  onBack: () => void;
  onPlaceOrder: () => void;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  label: string;
}

const PROMO_CODES: PromoCode[] = [
  { code: 'KBC10', discount: 10, type: 'percent', label: '10% off' },
  { code: 'WELCOME15', discount: 15, type: 'percent', label: '15% off' },
  { code: 'FREESHIP', discount: 0, type: 'fixed', label: 'Free shipping' },
  { code: 'KBC25', discount: 25, type: 'fixed', label: '$25 off' },
];

const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

export default function CheckoutPage({
  items,
  totalPrice,
  onBack,
  onPlaceOrder,
}: CheckoutPageProps) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.code === 'FREESHIP') return 0;
    if (appliedPromo.type === 'percent') {
      return (totalPrice * appliedPromo.discount) / 100;
    }
    return Math.min(appliedPromo.discount, totalPrice);
  }, [appliedPromo, totalPrice]);

  const freeShipping = appliedPromo?.code === 'FREESHIP';
  const shipping = freeShipping || totalPrice === 0 ? 0 : SHIPPING_COST;
  const tax = Math.max(0, (totalPrice - discount) * TAX_RATE);
  const grandTotal = Math.max(0, totalPrice - discount) + shipping + tax;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const found = PROMO_CODES.find((p) => p.code === code);
    if (found) {
      setAppliedPromo(found);
      setPromoError('');
      setPromoSuccess(`Code applied: ${found.label}!`);
      setPromoInput('');
      setTimeout(() => setPromoSuccess(''), 3000);
    } else {
      setPromoError('Invalid promo code. Try KBC10, WELCOME15, FREESHIP, or KBC25.');
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
    setPromoSuccess('');
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      nextErrors.email = 'Enter a valid email';
    }
    if (!form.firstName.trim()) nextErrors.firstName = 'Required';
    if (!form.lastName.trim()) nextErrors.lastName = 'Required';
    if (!form.address.trim()) nextErrors.address = 'Required';
    if (!form.city.trim()) nextErrors.city = 'Required';
    if (!form.zip.trim()) nextErrors.zip = 'Required';

    if (paymentMethod === 'card') {
      if (form.cardNumber.replace(/\s/g, '').length < 15) {
        nextErrors.cardNumber = 'Enter a valid card number';
      }
      if (!form.cardExpiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        nextErrors.cardExpiry = 'MM/YY';
      }
      if (form.cardCvc.length < 3) {
        nextErrors.cardCvc = 'CVC';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPlaceOrder();
    }, 1800);
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border bg-neutral-50 text-sm font-medium text-neutral-950 placeholder:text-neutral-400 outline-none transition-all ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-neutral-200 focus:border-neutral-950'
    }`;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <Tag size={28} className="text-neutral-300" />
          </div>
          <h1 className="text-2xl font-black text-neutral-950 mb-2">
            Nothing to check out
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            Your cart is empty. Add some pieces first.
          </p>
          <button
            onClick={onBack}
            className="bg-neutral-950 text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 md:pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-950 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </button>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950 mb-6 md:mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left: forms */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
              <h2 className="font-black text-base text-neutral-950 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                Contact
              </h2>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
              <h2 className="font-black text-base text-neutral-950 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className={inputClass('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className={inputClass('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.lastName}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <input
                    placeholder="Street address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={inputClass('address')}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.address}</p>
                  )}
                </div>
                <div>
                  <input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputClass('city')}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.city}</p>
                  )}
                </div>
                <div>
                  <input
                    placeholder="ZIP / Postal code"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    className={inputClass('zip')}
                  />
                  {errors.zip && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.zip}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-950 outline-none focus:border-neutral-950 transition-all"
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Japan</option>
                    <option>Nigeria</option>
                    <option>Other (International)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
              <h2 className="font-black text-base text-neutral-950 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                Payment
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-neutral-950 bg-neutral-950 text-white'
                      : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'
                  }`}
                >
                  <CreditCard size={18} />
                  Card
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-neutral-950 bg-neutral-950 text-white'
                      : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'
                  }`}
                >
                  <span className="text-base font-black italic">PayPal</span>
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-3">
                  <div>
                    <input
                      placeholder="Card number"
                      value={form.cardNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          cardNumber: formatCardNumber(e.target.value),
                        })
                      }
                      className={inputClass('cardNumber')}
                    />
                    {errors.cardNumber && (
                      <p className="text-xs text-red-500 mt-1.5">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        placeholder="MM/YY"
                        value={form.cardExpiry}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            cardExpiry: formatExpiry(e.target.value),
                          })
                        }
                        className={inputClass('cardExpiry')}
                      />
                      {errors.cardExpiry && (
                        <p className="text-xs text-red-500 mt-1.5">
                          {errors.cardExpiry}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        placeholder="CVC"
                        value={form.cardCvc}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4),
                          })
                        }
                        className={inputClass('cardCvc')}
                      />
                      {errors.cardCvc && (
                        <p className="text-xs text-red-500 mt-1.5">
                          {errors.cardCvc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-neutral-500">
                    You'll be redirected to PayPal to complete your purchase
                    securely.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-xs text-neutral-400">
                <Lock size={14} />
                Your payment information is encrypted and secure.
              </div>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-black text-base text-neutral-950 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 max-h-52 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-3"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-16 object-cover rounded-lg bg-neutral-100"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-neutral-950 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-neutral-950 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Size: {item.selectedSize}
                      </p>
                      <p className="font-bold text-xs text-neutral-950 mt-0.5">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="border-t border-neutral-100 pt-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} className="text-neutral-400" />
                  <span className="text-sm font-bold text-neutral-950">
                    Promo Code
                  </span>
                </div>

                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <div>
                        <p className="text-sm font-bold text-green-700">
                          {appliedPromo.code}
                        </p>
                        <p className="text-xs text-green-600">
                          {appliedPromo.label}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      aria-label="Remove promo code"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        placeholder="Enter code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleApplyPromo()
                        }
                        className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-950 placeholder:text-neutral-400 outline-none focus:border-neutral-950 transition-all uppercase"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-neutral-950 text-white text-sm font-bold px-4 rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500 mt-1.5">{promoError}</p>
                    )}
                    {promoSuccess && (
                      <p className="text-xs text-green-600 mt-1.5">
                        {promoSuccess}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {PROMO_CODES.map((p) => (
                        <button
                          key={p.code}
                          onClick={() => {
                            setPromoInput(p.code);
                            setAppliedPromo(p);
                            setPromoError('');
                            setPromoSuccess(`Code applied: ${p.label}!`);
                            setPromoInput('');
                            setTimeout(() => setPromoSuccess(''), 3000);
                          }}
                          className="text-[10px] font-bold px-2 py-1 rounded-md bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                        >
                          {p.code}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-neutral-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-bold text-neutral-950">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-bold text-green-600">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="font-bold text-neutral-950">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Tax (8%)</span>
                  <span className="font-bold text-neutral-950">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-neutral-100 mt-2">
                  <span className="font-black text-base text-neutral-950">
                    Total
                  </span>
                  <span className="font-black text-2xl text-neutral-950">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-neutral-950 text-white text-sm font-bold py-4 rounded-lg hover:bg-neutral-800 transition-colors active:scale-[0.98] mt-5 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Place Order - ${grandTotal.toFixed(2)}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} /> Secure
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={14} /> Free returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
