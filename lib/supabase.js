import { createClient } from '@supabase/supabase-js';

let rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Clean up any accidental outer quotes and whitespace
rawUrl = rawUrl.replace(/^['"]|['"]$/g, '').trim();

// Ensure it starts with https:// if it's a domain/string, or fallback to placeholder
let supabaseUrl = 'https://placeholder.supabase.co';
if (rawUrl) {
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        supabaseUrl = rawUrl;
    } else {
        supabaseUrl = `https://${rawUrl}`;
    }
}

const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key')
    .replace(/^['"]|['"]$/g, '')
    .trim();

export const supabase = createClient(supabaseUrl, supabaseKey);