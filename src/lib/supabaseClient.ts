import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
export const supabasePrivate = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY);
