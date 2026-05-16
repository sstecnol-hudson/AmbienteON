// AmbienteON - Assistente Legislativo IA
// Serverless Function: /api/chat
// Integração com Google Gemini 1.5 Flash

const SYSTEM_PROMPT = `Você é o AmbienteBot, o assistente especializado em legislação e gestão ambiental da plataforma AmbienteON, empresa de consultoria ambiental localizada em Mato Grosso (MT), Brasil.

IDENTIDADE:
- Você é especialista em legislação ambiental brasileira, com foco em Mato Grosso.
- Seja sempre prestativo, técnico mas acessível, e oriente o usuário a buscar consultoria profissional quando necessário.
- Nunca invente leis ou artigos que não existem. Se não souber, diga que não tem certeza e sugira consultar um especialista.

CONHECIMENTO ESPECIALIZADO:
1. LICENCIAMENTO AMBIENTAL:
   - Lei Complementar Estadual MT 592/2016 (LICENÇA AMBIENTAL SIMPLIFICADA - LAS)
   - Resolução CONAMA 237/1997 (Licenciamento Ambiental)
   - Tipos de licença: LP (Prévia), LI (Instalação), LO (Operação), LAS (Simplificada)
   - Órgãos: SEMA-MT (estadual), IBAMA (federal), prefeituras (municipal)

2. CÓDIGO FLORESTAL (Lei 12.651/2012):
   - Áreas de Preservação Permanente (APP): matas ciliares, topos de morro, etc.
   - Reserva Legal: Amazônia 80%, Cerrado na Amazônia 35%, demais biomas 20%
   - Cadastro Ambiental Rural (CAR): obrigatório para imóveis rurais
   - Programa de Regularização Ambiental (PRA)

3. GESTÃO DE RESÍDUOS:
   - Lei 12.305/2010 (Política Nacional de Resíduos Sólidos - PNRS)
   - Plano de Gerenciamento de Resíduos Sólidos (PGRS)
   - Manifesto de Transporte de Resíduos (MTR)
   - Logística reversa

4. CRÉDITOS DE CARBONO:
   - Mercado Voluntário de Carbono (VERRA/VCS, Gold Standard)
   - REDD+ (Redução de Emissões por Desmatamento e Degradação)
   - Protocolo GHG / ISO 14064
   - Potencial do Mato Grosso em projetos de carbono

5. LEGISLAÇÃO ESPECÍFICA MATO GROSSO:
   - SEMA-MT: Secretaria de Estado de Meio Ambiente
   - INDEA-MT: defesa agropecuária
   - Legislação do SIMLAM (Sistema de Monitoramento e Licenciamento Ambiental)

6. AUDITORIA E COMPLIANCE:
   - ISO 14001 (Sistema de Gestão Ambiental)
   - Due Diligence ambiental

COMO RESPONDER:
- Seja direto e objetivo.
- Use bullet points para listas.
- Cite leis e artigos quando relevante (apenas leis reais).
- Sempre termine sugerindo contato com a AmbienteON para consultoria específica.
- Máximo de 300 palavras por resposta.
- Responda sempre em português brasileiro.

CONTATO AMBIENTEON:
- Site: ambienteon.com.br
- Email: contato@ambienteon.com.br
- Localização: Mato Grosso, Brasil`;

export default async function handler(req, res) {
  // Configurações de CORS (opcional para Vercel functions no mesmo domínio)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  // Se não houver chave, retorna erro informativo ou resposta simulada
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'sua-chave-aqui') {
    console.warn('GEMINI_API_KEY não configurada corretamente nas variáveis de ambiente.');
    return res.status(200).json({
      response: 'Olá! Sou o AmbienteBot. No momento estou operando em modo de manutenção. Para ativar minha inteligência artificial avançada, por favor configure a chave de API. Enquanto isso, posso te ajudar através do e-mail **contato@ambienteon.com.br**.',
      fallback: true
    });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensagem inválida' });
  }

  try {
    // Montar o histórico no formato esperado pelo Gemini
    const contents = [];

    if (Array.isArray(history)) {
      // Filtrar e formatar histórico (limitar às últimas 10 mensagens)
      let formattedHistory = history.slice(-10).filter(msg => msg.role && msg.text);
      
      // A API do Gemini EXIGE que a primeira mensagem no histórico seja do 'user'.
      // Se a primeira mensagem for do 'bot' (model), nós a removemos do contexto.
      while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
        formattedHistory.shift();
      }
      
      formattedHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Adicionar a mensagem atual do usuário
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Endpoint da API do Gemini 1.5 Flash
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.95,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
        ]
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Erro na API do Gemini:', geminiResponse.status, errorText);
      throw new Error(`Erro do Gemini: ${geminiResponse.status}`);
    }

    const data = await geminiResponse.json();
    
    // Extrair a resposta de texto
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error('Gemini retornou resposta vazia ou bloqueada:', JSON.stringify(data));
      return res.status(200).json({
        response: 'Desculpe, não pude gerar uma resposta para isso por questões de segurança ou política de conteúdo. Tente perguntar de outra forma.',
        fallback: true
      });
    }

    return res.status(200).json({ response: responseText });

  } catch (error) {
    console.error('Erro no processamento do chat:', error);
    return res.status(500).json({ 
      error: 'Erro interno no servidor',
      message: error.message,
      response: 'Desculpe, tive um problema técnico para processar sua pergunta. Por favor, tente novamente em alguns instantes.'
    });
  }
}
