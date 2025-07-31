import { createClient } from '@supabase/supabase-js';

// As variáveis de ambiente NEXT_PUBLIC_... são carregadas automaticamente pelo Next.js
const supabaseUrl = 'https://pcvqefmcsxvpsoosglgf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cria e exporta uma única instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

