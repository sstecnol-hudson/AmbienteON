import { Resend } from 'resend';

// Inicializa o Resend usando a variável de ambiente (configurada na Vercel)
// Exemplo de chave: re_123456789...
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export default async function handler(req, res) {
  // Apenas aceita requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const data = req.body;
    
    // Verifica o tipo de formulário (contato, solicitacao, lead)
    const type = data.type || 'Contato Geral';
    let subject = `Novo Contato AmbienteON - ${type}`;
    let htmlContent = `<h2>Novo Formulário de ${type}</h2>`;
    
    // Constrói o corpo do email com os dados recebidos
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'type' && value) {
        htmlContent += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</p>`;
      }
    }

    // Tenta salvar no Supabase (Fase 3)
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('leads').insert([{
          tipo: type,
          dados: data,
          created_at: new Date()
        }]);
      }
    } catch (dbError) {
      console.warn('Falha ao salvar no banco de dados, mas prosseguindo com email:', dbError);
    }

    // Tenta enviar o email
    const emailResponse = await resend.emails.send({
      from: 'AmbienteON <noreply@ambienteon.com.br>',
      to: process.env.CONTACT_EMAIL || 'contato@ambienteon.com.br',
      reply_to: data.email || undefined,
      subject: subject,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 1.5rem;">AmbienteON</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Novo Contato Recebido</p>
          </div>
          <div style="padding: 32px; background: #f9fafb;">
            <h2 style="color: #065f46; margin-top: 0;">Formulário: ${type}</h2>
            ${htmlContent}
          </div>
          <div style="padding: 16px; background: #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 0.8rem; margin: 0;">AmbienteON – Gestão Ambiental Inteligente | ambienteon.com.br</p>
          </div>
        </div>
      `,
    });

    // Se estivermos num ambiente de desenvolvimento/teste sem chave válida, simulamos sucesso
    if (process.env.RESEND_API_KEY === undefined) {
      console.log('--- SIMULAÇÃO DE EMAIL (Falta RESEND_API_KEY) ---');
      console.log(htmlContent);
      return res.status(200).json({ message: 'Email simulado com sucesso (configure a API Key na Vercel)', simulated: true });
    }

    return res.status(200).json({ message: 'Email enviado com sucesso', id: emailResponse.id });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ message: 'Erro ao processar sua solicitação', error: error.message });
  }
}
