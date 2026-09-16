import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { products as fallbackProducts } from '@/data/products';
import type { Product } from '@/types';

interface DbProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
}

function mapProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    image: p.image,
    images: p.images && p.images.length > 0 ? p.images : [p.image],
    description: p.description,
    details: p.details || [],
    sizes: p.sizes || [],
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) {
      setProducts(data.map(mapProduct));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}
