import { supabase } from './supabase';

export interface CartRow {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    products?: {
        id: string;
        name: string;
        price: number;
        image_url: string;
    };
}

// Récupère le panier de l'utilisateur connecté avec les infos produit
export async function fetchCart() {
    const { data, error } = await supabase
        .from('cart')
        .select('*, products(id, name, price, image_url)')
        .order('created_at', { ascending: true });
    return { data, error };
}

// Ajoute ou incrémente un produit
export async function upsertCartItem(productId: string, quantity: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non connecté');

    const { error } = await supabase
        .from('cart')
        .upsert(
            { user_id: user.id, product_id: productId, quantity },
            { onConflict: 'user_id,product_id' }
        );
    return { error };
}

// Met à jour la quantité
export async function updateCartItem(productId: string, quantity: number) {
    const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('product_id', productId);
    return { error };
}

// Supprime un article
export async function deleteCartItem(productId: string) {
    const { error } = await supabase
        .from('cart')
        .delete()
        .eq('product_id', productId);
    return { error };
}

// Vide le panier
export async function clearCartRemote() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non connecté');

    const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);
    return { error };
}