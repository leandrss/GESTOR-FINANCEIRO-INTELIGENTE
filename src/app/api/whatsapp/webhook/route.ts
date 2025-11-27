import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'finz_webhook_token_2024';
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// Inicializar OpenAI apenas se a chave estiver disponível
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Armazenamento temporário de conversas (em produção, use banco de dados)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

// Função para enviar mensagem via WhatsApp Cloud API
async function sendWhatsAppMessage(to: string, message: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.error('WhatsApp credentials not configured');
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    const data = await response.json();
    console.log('WhatsApp message sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

// Função para processar mensagem com IA
async function processMessageWithAI(userMessage: string, phoneNumber: string) {
  // Obter histórico da conversa
  let history = conversations.get(phoneNumber) || [];
  
  // Se é a primeira mensagem, enviar boas-vindas
  if (history.length === 0) {
    const welcomeMessage = `Olá! Eu sou o assistente oficial do aplicativo FINZ.\nAntes de começarmos, posso saber seu nome ou acessar seu cadastro automaticamente pelo número?\n\nEscolha uma opção:\n1️⃣ Como usar o aplicativo\n2️⃣ Suporte técnico\n3️⃣ Área premium\n4️⃣ Conversar com atendente\n5️⃣ Dúvidas gerais`;

    history.push({ role: 'assistant', content: welcomeMessage });
    conversations.set(phoneNumber, history);
    return welcomeMessage;
  }

  // Adicionar mensagem do usuário ao histórico
  history.push({ role: 'user', content: userMessage });

  // Se OpenAI não estiver configurado, retornar resposta padrão
  if (!openai) {
    const defaultResponse = `Recebi sua mensagem: "${userMessage}"\n\nNo momento, estou operando em modo básico. Para respostas inteligentes, configure a chave da OpenAI.\n\nPosso ajudar com:\n1️⃣ Informações sobre o FINZ\n2️⃣ Falar com atendente\n3️⃣ Área premium`;
    
    history.push({ role: 'assistant', content: defaultResponse });
    conversations.set(phoneNumber, history);
    return defaultResponse;
  }

  // Criar prompt do sistema com contexto do FINZ
  const systemPrompt = `Você é o assistente oficial do FINZ, um aplicativo de gestão financeira inteligente.

SUAS FUNÇÕES:
1. Cadastro e identificação: Identificar usuários pelo WhatsApp e criar cadastros
2. Suporte geral: Explicar funcionalidades do app (registro via WhatsApp, boletos automáticos, relatórios)
3. Área premium: Explicar benefícios (R$ 9,99/mês) e enviar link de pagamento
4. Respostas inteligentes: Interpretar perguntas e responder naturalmente
5. Ações automáticas: Consultar dados, atualizar informações, enviar notificações
6. Atendimento humano: Transferir para atendente quando solicitado

FUNCIONALIDADES DO FINZ:
- Registro automático via WhatsApp (ex: "gastei 50 no mercado")
- Busca automática de boletos por CPF/CNPJ
- Relatórios inteligentes com gráficos e insights
- Gestão CPF e CNPJ (pessoal e empresarial)
- Sugestões de economia personalizadas
- Dashboard empresarial completo

ESTILO DE RESPOSTA:
- Educado, direto e inteligente
- Linguagem simples e humana
- Nunca responder sem certeza (pedir confirmação)
- Evitar textos longos demais
- Use emojis quando apropriado

COMANDOS ESPECIAIS:
- Se usuário pedir "falar com atendente": informar que está transferindo
- Se usuário perguntar sobre pagamento: enviar link e explicar benefícios
- Se usuário pedir ajuda: mostrar menu de opções`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0].message.content || 'Desculpe, não entendi. Pode reformular?';
    
    // Adicionar resposta ao histórico
    history.push({ role: 'assistant', content: assistantMessage });
    
    // Limitar histórico a últimas 20 mensagens
    if (history.length > 20) {
      history = history.slice(-20);
    }
    
    conversations.set(phoneNumber, history);
    
    return assistantMessage;
  } catch (error) {
    console.error('Error processing with AI:', error);
    return 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em instantes.';
  }
}

// GET - Verificação do webhook (Meta exige isso)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// POST - Receber mensagens do WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Verificar se é uma mensagem
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages) {
        const message = value.messages[0];
        const from = message.from; // Número do usuário
        const messageBody = message.text?.body;

        if (messageBody) {
          console.log(`Message from ${from}: ${messageBody}`);

          // Processar mensagem com IA
          const response = await processMessageWithAI(messageBody, from);

          // Enviar resposta
          await sendWhatsAppMessage(from, response);
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
