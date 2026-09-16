import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Search,
  Package,
  Image as ImageIcon,
  Loader2,
  Save,
  AlertCircle,
} from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
}

interface EditForm {
  id?: number;
  name: string;
  category: string;
  price: string;
  image: string;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
}

const EMPTY_FORM: EditForm = {
  name: '',
  category: '',
  price: '',
  image: '',
  images: [],
  description: '',
  details: [],
  sizes: [],
};

const CATEGORIES = [
  'T-Shirts',
  'Hoodies',
  'Jeans',
  'Jackets',
  'Footwear',
  'Accessories',
];

export default function AdminPage({ onBack }: AdminPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      setError('Failed to load products: ' + error.message);
    } else if (data) {
      setProducts(
        data.map((p: Record<string, unknown>) => ({
          id: p.id as number,
          name: p.name as string,
          category: p.category as string,
          price: Number(p.price),
          image: p.image as string,
          images: (p.images as string[]) || [],
          description: p.description as string,
          details: (p.details as string[]) || [],
          sizes: (p.sizes as string[]) || [],
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.category.trim() || !editing.price) {
      setError('Name, category, and price are required.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: editing.name.trim(),
      category: editing.category.trim(),
      price: parseFloat(editing.price),
      image: editing.image,
      images: editing.images,
      description: editing.description.trim(),
      details: editing.details,
      sizes: editing.sizes,
    };

    if (editing.id) {
      const { error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editing.id);

      if (updateError) {
        setError('Update failed: ' + updateError.message);
      } else {
        setEditing(null);
        await fetchProducts();
      }
    } else {
      const { error: insertError } = await supabase
        .from('products')
        .insert(payload);

      if (insertError) {
        setError('Insert failed: ' + insertError.message);
      } else {
        setEditing(null);
        await fetchProducts();
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    setSaving(true);
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteId);

    if (deleteError) {
      setError('Delete failed: ' + deleteError.message);
    } else {
      setDeleteId(null);
      await fetchProducts();
    }
    setSaving(false);
  };

  const uploadImage = async (file: File, isMainImage: boolean) => {
    setUploading(true);
    setError('');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setError('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    const url = urlData.publicUrl;

    if (isMainImage) {
      setEditing((prev) =>
        prev ? { ...prev, image: url, images: [url, ...prev.images] } : prev
      );
    } else {
      setEditing((prev) =>
        prev ? { ...prev, images: [...prev.images, url] } : prev
      );
    }

    setUploading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file, isMain);
    e.target.value = '';
  };

  const removeGalleryImage = (index: number) => {
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            image: index === 0 && prev.images.length > 1 ? prev.images[1] : prev.image,
          }
        : prev
    );
  };

  const addDetail = () => {
    setEditing((prev) => (prev ? { ...prev, details: [...prev.details, ''] } : prev));
  };

  const updateDetail = (index: number, value: string) => {
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            details: prev.details.map((d, i) => (i === index ? value : d)),
          }
        : prev
    );
  };

  const removeDetail = (index: number) => {
    setEditing((prev) =>
      prev ? { ...prev, details: prev.details.filter((_, i) => i !== index) } : prev
    );
  };

  const addSize = () => {
    setEditing((prev) => (prev ? { ...prev, sizes: [...prev.sizes, ''] } : prev));
  };

  const updateSize = (index: number, value: string) => {
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            sizes: prev.sizes.map((s, i) => (i === index ? value : s)),
          }
        : prev
    );
  };

  const removeSize = (index: number) => {
    setEditing((prev) =>
      prev ? { ...prev, sizes: prev.sizes.filter((_, i) => i !== index) } : prev
    );
  };

  const startEdit = (product: Product) => {
    setEditing({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.toFixed(2),
      image: product.image,
      images: product.images,
      description: product.description,
      details: product.details,
      sizes: product.sizes,
    });
  };

  const startNew = () => {
    setEditing({ ...EMPTY_FORM });
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-950 placeholder:text-neutral-400 outline-none focus:border-neutral-950 transition-all';

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 md:pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Store
            </button>
            <span className="text-neutral-300">/</span>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-neutral-950">
              Admin
            </h1>
          </div>
          <button
            onClick={startNew}
            className="flex items-center gap-2 bg-neutral-950 text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-400 mb-1">
              <Package size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-black text-neutral-950">{products.length}</p>
          </div>
          {CATEGORIES.slice(0, 3).map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return (
              <div key={cat} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-neutral-400 mb-1">
                  <ImageIcon size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">{cat}</span>
                </div>
                <p className="text-2xl font-black text-neutral-950">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-950 placeholder:text-neutral-400 outline-none focus:border-neutral-950 transition-all"
          />
        </div>

        {/* Product table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-neutral-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Package size={32} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-neutral-950 mb-1">No products found</p>
            <p className="text-xs text-neutral-500">
              {search ? 'Try a different search.' : 'Add your first product to get started.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-3">
                      Product
                    </th>
                    <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-3 hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-3">
                      Price
                    </th>
                    <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-3 hidden sm:table-cell">
                      Sizes
                    </th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-12 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                          />
                          <span className="font-bold text-sm text-neutral-950 truncate">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-black text-sm text-neutral-950">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-neutral-500">
                          {product.sizes.join(', ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(product)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-900 hover:text-white transition-colors"
                            aria-label="Edit product"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-red-500 hover:text-white transition-colors"
                            aria-label="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Create modal */}
      {editing && (
        <div className="fixed inset-0 z-[90] bg-neutral-950/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-0 md:p-6 animate-[fadeUp_0.2s_ease-out]">
          <div className="bg-white w-full max-w-2xl md:rounded-2xl shadow-2xl min-h-screen md:min-h-0 md:max-h-[90vh] md:overflow-y-auto animate-[slideUp_0.3s_ease-out]">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 md:px-6 py-4 border-b border-neutral-100">
              <h2 className="font-black text-lg text-neutral-950">
                {editing.id ? 'Edit Product' : 'New Product'}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-5 md:px-6 py-5 space-y-5">
              {/* Image upload */}
              <div>
                <label className="text-sm font-bold text-neutral-950 mb-2 block">
                  Main Image
                </label>
                <div className="flex items-center gap-4">
                  {editing.image ? (
                    <img
                      src={editing.image}
                      alt="Main"
                      className="w-20 h-24 object-cover rounded-lg bg-neutral-100"
                    />
                  ) : (
                    <div className="w-20 h-24 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <ImageIcon size={24} className="text-neutral-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, true)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-600 hover:border-neutral-950 hover:text-neutral-950 transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      Upload Image
                    </button>
                    <input
                      placeholder="Or paste image URL"
                      value={editing.image.startsWith('http') ? '' : editing.image}
                      onChange={(e) =>
                        setEditing({ ...editing, image: e.target.value })
                      }
                      className="mt-2 text-xs px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 w-full outline-none focus:border-neutral-950"
                    />
                  </div>
                </div>
              </div>

              {/* Gallery images */}
              <div>
                <label className="text-sm font-bold text-neutral-950 mb-2 block">
                  Gallery Images ({editing.images.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {editing.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-neutral-950 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-20 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center cursor-pointer hover:border-neutral-950 transition-colors">
                    {uploading ? (
                      <Loader2 size={16} className="animate-spin text-neutral-400" />
                    ) : (
                      <Plus size={20} className="text-neutral-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-bold text-neutral-950 mb-2 block">
                  Product Name
                </label>
                <input
                  placeholder="e.g. KBC Essential Tee"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-bold text-neutral-950 mb-2 block">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-neutral-950 mb-2 block">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-bold text-neutral-950 mb-2 block">
                  Description
                </label>
                <textarea
                  placeholder="Short product description..."
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-neutral-950">Sizes</label>
                  <button
                    onClick={addSize}
                    className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-950 transition-colors"
                  >
                    <Plus size={14} /> Add Size
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editing.sizes.map((size, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <input
                        value={size}
                        onChange={(e) => updateSize(i, e.target.value)}
                        placeholder="e.g. M"
                        className="w-16 px-2.5 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-950 outline-none focus:border-neutral-950"
                      />
                      <button
                        onClick={() => removeSize(i)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {editing.sizes.length === 0 && (
                    <p className="text-xs text-neutral-400">No sizes added yet.</p>
                  )}
                </div>
              </div>

              {/* Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-neutral-950">
                    Product Details
                  </label>
                  <button
                    onClick={addDetail}
                    className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-950 transition-colors"
                  >
                    <Plus size={14} /> Add Detail
                  </button>
                </div>
                <div className="space-y-2">
                  {editing.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={detail}
                        onChange={(e) => updateDetail(i, e.target.value)}
                        placeholder="e.g. 100% cotton, 240 GSM"
                        className="flex-1 px-3.5 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-950 outline-none focus:border-neutral-950"
                      />
                      <button
                        onClick={() => removeDetail(i)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {editing.details.length === 0 && (
                    <p className="text-xs text-neutral-400">No details added yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-5 md:px-6 py-4 flex items-center gap-3">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 text-sm font-bold py-3 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-neutral-950 text-white text-sm font-bold py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {editing.id ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[90] bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeUp_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-[slideUp_0.3s_ease-out]">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-black text-neutral-950 text-center mb-2">
              Delete this product?
            </h3>
            <p className="text-sm text-neutral-500 text-center mb-6">
              This action cannot be undone. The product and its images will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 text-sm font-bold py-3 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white text-sm font-bold py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
