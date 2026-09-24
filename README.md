# SD EVENTOS — Aplicação Web & Plataforma Comercial de Buffets

Plataforma digital moderna, responsiva e comercial desenvolvida sob medida para a **SD Eventos** (Buffet a domicílio e serviços para festas e eventos).

---

## 🎯 Objetivo da Solução

Transformar a jornada do cliente que busca buffet em São Paulo e Região Metropolitana, substituindo dúvidas repetitivas no WhatsApp por uma experiência interativa de simulação prévia ("Monte seu Evento"), permitindo que o cliente:
1. Conheça as opções gastronômicas com fotos em alta resolução;
2. Entenda claramente o que está e o que não está incluso em cada pacote;
3. Simule a quantidade de convidados e selecione adicionais desejados;
4. Visualize uma estimativa inicial de investimento calculada em tempo real;
5. Envie uma solicitação estruturada em 1 clique diretamente para o WhatsApp oficial da SD Eventos (+55 11 98406-6393);
6. Alimente automaticamente o painel administrativo interno (`/admin`) para gestão de leads.

---

## 🎨 Identidade Visual & Design System

- **Verde Escuro Gastronômico** (`#0B2F21`, `#072017`): Transmite sofisticação, seriedade e tradição culinária.
- **Laranja Acolhedor** (`#E0631B`, `#C44E0F`): Estimula o apetite, a comemoração e guia os pontos de conversão (CTAs).
- **Creme / Off-White** (`#FAF8F5`, `#F3EFE9`): Espaço em branco generoso, legibilidade e elegância.
- **Dourado Discreto** (`#C5A059`): Realce sutil em insígnias, ícones e detalhes premium.

---

## 📱 Mobile-First

Desenvolvido e testado com foco estrito em telas de smartphones (**360px**, **375px**, **390px**, **430px**) e expansível para tablets e desktops:
- Sem overflow horizontal;
- Botões e inputs com área de toque mínima de 44px;
- Botão flutuante do WhatsApp posicionado com respeito à `safe-area-inset-bottom`;
- Navegação fluida em Step Form para evitar formulários cansativos.

---

## 🚀 Tecnologias

- **Next.js 16 (App Router & Turbopack)**
- **React 19**
- **TypeScript strict**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Framer Motion**
- **SEO & Schema.org (`FoodEstablishment`)**
- **Deploy pronto para Vercel**

---

## 📂 Estrutura de Diretórios

```
app/
  layout.tsx            # Layout global, SEO, Json-LD, Navbar, Footer, Floating WhatsApp
  page.tsx              # Home com Hero, 4 Buffets, Como Funciona (5 passos), Depoimentos, FAQ
  servicos/page.tsx     # Catálogo completo dos 4 buffets com itens inclusos/não inclusos e fotos
  monte-seu-evento/     # Simulador Step Form (Etapas 1 a 6 + Resumo Final + WhatsApp)
  galeria/page.tsx      # Galeria filtrável por categorias com Lightbox interativo
  sobre/page.tsx        # História, valores, hospitalidade e padrões de entrega
  duvidas/page.tsx      # FAQ completo com pesquisa em tempo real
  contato/page.tsx      # Canais diretos (WhatsApp, Instagram, Horários) e formulário
  admin/page.tsx        # Painel Administrativo interno para gestão de orçamentos e serviços
  api/quotes/route.ts   # API com validação, recálculo de preço no servidor e rate limiting
  sitemap.ts            # Gerador dinâmico de sitemap.xml
  robots.ts             # Configuração de indexação robots.txt
components/
  layout/               # Navbar, Footer, FloatingWhatsApp
  home/                 # Hero, ServicesPreview, HowItWorks, AboutSnippet, Testimonials, FAQ
  services/             # Componentes de apresentação de cardápios
  event-builder/        # Wizard interativo de simulação de orçamento
  gallery/              # Grid de fotos e modal de Lightbox
  admin/                # Dashboard executivo, tabela de solicitações, modal de detalhes
data/
  company.ts            # Dados institucionais e canais de contato
  services.ts           # Cardápios (Churrasco, Finger Foods, Massas, Personalizado)
  addons.ts             # Bebidas, sobremesas, entradas, garçons, louças
  faq.ts                # Perguntas frequentes
  gallery.ts            # Fotos em alta resolução categorizadas
  mock-quotes.ts        # Leads de demonstração para o painel administrativo
lib/
  whatsapp.ts           # Gerador de mensagens formatadas e encodeURIComponent
  pricing.ts            # Cálculo de estimativas e formatação de moeda BRL
  validation.ts         # Sanitização e validações
  storage.ts            # Persistência local e sincronização
```

---

## 🛠️ Como Executar Localmente

1. **Instalar dependências:**
```bash
npm install
```

2. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```
Acesse `http://localhost:3000`.

3. **Verificar tipagem e build:**
```bash
npm run build
```

4. **Executar linter:**
```bash
npm run lint
```

---

## 🔌 Próximos Passos: Integração com Supabase

A arquitetura foi estruturada para uma migração direta para o banco de dados Supabase:
1. Criar a tabela `quote_requests` no Supabase com os mesmos campos definidos em `types/index.ts` (`QuoteRequest`).
2. Adicionar as credenciais no arquivo `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. No arquivo `app/api/quotes/route.ts`, descomentar a chamada do cliente Supabase para persistência remota.
