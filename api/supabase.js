import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sua-url.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sua-chave-anonima';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para salvar lead no banco de dados
export async function saveLead(data) {
  const { data: result, error } = await supabase
    .from('leads')
    .insert([
      { 
        tipo: data.type,
        nome: data.nome || data.contact || 'N/A',
        email: data.email,
        telefone: data.phone || data.whatsapp || 'N/A',
        empresa: data.company || 'N/A',
        servicos: data.services || [],
        mensagem: data.message || '',
        dados_adicionais: data
      }
    ]);
    
  if (error) throw error;
  return result;
}
