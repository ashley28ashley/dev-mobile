import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
  created_at?: string;
}

// Fetch all products
export const listProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

// Fetch a single product by ID
export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

// Create a new product (admin)
export const createProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('products').insert(product).single();
  return { data, error };
};

// Update an existing product (admin)
export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .single();
  return { data, error };
};

// Delete a product (admin)
export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  return { error };
};