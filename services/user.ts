import { supabase } from './supabase';

/**
 * Retourne le rôle de l'utilisateur connecté (ex: 'admin' ou 'client').
 * Si aucun profil n'est trouvé, renvoie 'client' par défaut.
 */
export const getUserRole = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'client';
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (error) {
    console.warn('Impossible de récupérer le rôle, fallback à client', error);
    return 'client';
  }
  return data?.role ?? 'client';
};

export const isAdmin = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'admin';
};
