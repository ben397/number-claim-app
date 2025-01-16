import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchClaimedNumbers() {
  const { data, error } = await supabase
    .from('claimed_numbers')
    .select('number');
  
  if (error) throw error;
  return data;
}

export async function claimNumber(name, number, clientId) {
  const { data, error } = await supabase
    .from('claimed_numbers')
    .insert([
      {
        name,
        number,
        client_id: clientId
      }
    ]);
  
  if (error) throw error;
  return data;
}

export async function checkExistingClaim(clientId) {
  const { data, error } = await supabase
    .from('claimed_numbers')
    .select()
    .eq('client_id', clientId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}