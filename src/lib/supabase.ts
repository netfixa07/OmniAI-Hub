import { createClient } from '@supabase/supabase-js';

// Usamos as variáveis de ambiente se disponíveis, ou fazemos fallback para as chaves fornecidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ufrlyaoopntbgbwfwzlz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7SqeJPGe4POvzR6HBD4XVg_CfsE282E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
