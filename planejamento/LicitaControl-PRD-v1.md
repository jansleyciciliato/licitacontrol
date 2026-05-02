# PRD — LicitaControl

Plataforma de Gestão e Análise de Licitações com Inteligência Artificial
*Da leitura manual de editais à gestão centralizada, em segundos.*

Versão 1.1 · PRD Completo
Desenvolvimento guiado via Claude Code
Presidente Prudente · 2026

---

## Como usar este PRD

Este documento foi escrito para desenvolvimento guiado via Claude Code por um profissional sem experiência prévia com programação. A estrutura é sequencial: cada seção prepara o terreno para a próxima.

Você não precisa entender todo o conteúdo técnico antes de começar. Seu papel é entender o produto e as decisões de negócio. A tradução para código será feita pelo Claude Code.

### Estrutura do documento

1. **Visão do Produto** — o que é, para quem é e por que existe
2. **Personas e Jobs to be Done** — quem usa e o que precisa fazer
3. **Requisitos Funcionais** — o que o sistema deve fazer, com critérios de aceitação
4. **Requisitos Não-Funcionais** — performance, segurança, usabilidade
5. **Especificações Técnicas** — stack, arquitetura e integrações
6. **Modelo de Dados** — estrutura completa do banco de dados
7. **Fluxos Detalhados** — passo a passo de cada operação principal
8. **Design e Interface** — identidade visual, componentes e páginas
9. **IA e Prompts** — agente de análise com prompt completo e configuração de modelos
10. **Segurança e LGPD** — proteção de dados e conformidade
11. **Plano de Execução** — sprints, riscos e critérios de pronto
12. **Glossário** — todos os termos técnicos explicados em linguagem simples

---

## 1. Visão do Produto

### 1.1 Elevator Pitch

O LicitaControl é uma plataforma interna de gestão de licitações que usa Inteligência Artificial para eliminar o trabalho manual de ler e catalogar editais. Em vez de gastar 1 a 2 horas por edital anotando informações em planilhas, o usuário faz o upload do documento e o sistema extrai, organiza e salva todos os dados automaticamente. O resultado é um painel centralizado com todas as oportunidades classificadas por status, com dashboard de desempenho e visão detalhada de cada licitação — tudo acessível em segundos.

### 1.2 Problema que resolve

Empresas que participam de licitações públicas e prestadores de serviço que gerenciam essas oportunidades enfrentam um processo manual e desgastante: cada edital precisa ser lido na íntegra, as informações relevantes anotadas manualmente e o andamento controlado em planilhas ou cadernos. Com volumes crescentes de licitações, esse processo escala mal — cada novo edital representa 1 a 2 horas de trabalho repetitivo, sujeito a erros e esquecimentos. As ferramentas existentes no mercado são genéricas, caras ou voltadas para busca de editais, não para gestão do pipeline de oportunidades com extração inteligente de dados.

### 1.3 Proposta de valor

Para empresas e prestadores de serviço que participam de licitações públicas e perdem horas por semana em catalogação manual de editais, o LicitaControl é uma plataforma de gestão que usa IA para extrair e organizar automaticamente as informações de qualquer edital em PDF, Word ou TXT. Diferente de planilhas e ferramentas genéricas, o LicitaControl transforma o upload de um documento em um registro completo e estruturado em segundos, com gestão de pipeline por status e dashboard de desempenho.

### 1.4 Diferenciação competitiva

| Funcionalidade | LicitaControl | Planilha Excel | LicitaIA | Portal de Licitações |
|---|---|---|---|---|
| Extração automática por IA | ✅ | ❌ | ✅ | ❌ |
| Aceita PDF, Word e TXT | ✅ | ❌ | ❌ | ❌ |
| Escolha do modelo de IA | ✅ | ❌ | ❌ | ❌ |
| Gestão de pipeline por status | ✅ | ✅ manual | ✅ | ❌ |
| Dashboard de desempenho | ✅ | ✅ manual | ❌ | ❌ |
| Uso interno / sem mensalidade SaaS | ✅ | ✅ | ❌ | ❌ |
| Edição manual de campos | ✅ | ✅ | ❌ | ❌ |
| Sem limite de licitações | ✅ | ✅ | ❌ | ❌ |
| Multi-usuário futuro | ✅ planejado | ❌ | ✅ | ❌ |

### 1.5 Objetivos e métricas (OKRs)

**Objetivo 1: Eliminar o trabalho manual de catalogação de editais**
- KR1: 100% das licitações inclusas via upload — zero entrada manual de dados no fluxo principal
- KR2: Tempo médio do upload ao registro completo inferior a 60 segundos
- KR3: Taxa de campos preenchidos corretamente pela IA acima de 85% nos editais testados

**Objetivo 2: Centralizar a gestão do pipeline de licitações**
- KR1: Todas as licitações ativas visíveis em uma única tela com filtro por status
- KR2: Dashboard com pelo menos 4 indicadores de desempenho funcionando no MVP
- KR3: Qualquer campo de qualquer licitação editável em menos de 3 cliques

---

## 2. Personas e Jobs to be Done

### 2.1 Persona primária — O Analista de Licitações

- **Nome fictício:** Rafael Mendes
- **Cargo/Perfil:** Analista de licitações em empresa de médio porte que participa de 10 a 30 pregões por mês
- **Dores principais:**
  - Gasta de 1 a 2 horas por edital fazendo leitura e anotações
  - Perde prazos porque as informações estão espalhadas em planilhas desorganizadas
  - Não consegue ter uma visão clara de quantas licitações está gerenciando e qual o status de cada uma
  - Dificuldade em encontrar informações específicas dentro de editais longos
- **Motivações:**
  - Participar de mais licitações no mesmo tempo
  - Ter controle claro do pipeline de oportunidades
  - Reduzir erros e esquecimentos
- **Frase que ele diria:** "Eu passo metade do dia lendo edital para anotar coisa que o sistema deveria fazer sozinho."

### 2.2 Persona secundária — O Prestador de Serviço

- **Nome fictício:** Carla Souza
- **Cargo/Perfil:** Dona de pequena consultoria que gerencia licitações para 3 a 5 clientes simultaneamente
- **Dores principais:**
  - Volume alto de editais de clientes diferentes para analisar
  - Não tem sistema próprio — usa pastas, emails e planilhas
- **Motivações:**
  - Atender mais clientes sem aumentar a equipe
  - Ter registro histórico das licitações por resultado
- **Frase que ela diria:** "Preciso de um jeito rápido de saber o que está acontecendo com cada licitação dos meus clientes."

### 2.3 Jobs to be Done

- "Quando eu recebo um novo edital, eu quero que as informações sejam extraídas automaticamente, para que eu não precise ler o documento inteiro para cadastrar a licitação."
- "Quando eu acesso o sistema, eu quero ver o status de todas as licitações em andamento, para que eu não perca prazos nem esqueça oportunidades."
- "Quando uma licitação avança de etapa, eu quero atualizar o status rapidamente, para que o painel reflita a situação real do pipeline."
- "Quando quero avaliar meu desempenho, eu quero ver quantas licitações venci e qual o valor total, para que eu possa tomar decisões sobre quais tipos de oportunidade vale a pena perseguir."

---

## 3. Requisitos Funcionais

Convenção: RF = Requisito Funcional. Prioridade: **[P0]** crítico para o MVP, **[P1]** importante, **[P2]** desejável para versão futura.

### 3.1 Épico: Upload e Análise por IA

#### RF-01 [P0] — Upload de documento (PDF, Word ou TXT)
- **Descrição:** O sistema deve permitir o upload de arquivos nos formatos PDF (.pdf), Word (.doc, .docx) e texto puro (.txt) através de uma interface de arrastar e soltar ou botão de seleção de arquivo.
- **Critérios de aceitação:**
  - [ ] Aceita arquivos com extensão: `.pdf`, `.doc`, `.docx`, `.txt`
  - [ ] Exibe mensagem de erro clara se o formato não for suportado: "Formato não suportado. Envie um arquivo PDF, Word (.doc/.docx) ou TXT."
  - [ ] Exibe barra de progresso ou indicador de carregamento durante o upload
  - [ ] Tamanho máximo do arquivo: 20MB — exibe aviso se excedido: "Arquivo muito grande. Máximo permitido: 20MB."
  - [ ] Após o upload, inicia automaticamente o processo de extração de texto

#### RF-02 [P0] — Extração de texto do documento
- **Descrição:** Após o upload, o sistema extrai o conteúdo textual do documento de acordo com o formato recebido, para envio à IA.
- **Critérios de aceitação:**
  - [ ] PDF: extrai texto com `pdf-parse` (funciona apenas com PDFs digitais com texto selecionável)
  - [ ] Word (.docx): extrai texto com `mammoth`
  - [ ] Word (.doc legado): converte e extrai texto com `mammoth`
  - [ ] TXT: lê o conteúdo diretamente sem biblioteca adicional
  - [ ] Exibe indicador visual: "Extraindo texto do documento..."
  - [ ] Se o arquivo estiver corrompido, protegido ou sem texto extraível, exibe: "Não foi possível extrair o texto deste arquivo. Verifique se ele não está corrompido ou protegido."
  - [ ] Em caso de erro, o processo é interrompido e nenhum registro incompleto é salvo

#### RF-03 [P0] — Configuração do modelo de IA
- **Descrição:** Antes de iniciar o upload (ou nas configurações do sistema), o usuário pode escolher qual modelo de IA será usado para a análise dos documentos.
- **Critérios de aceitação:**
  - [ ] Dropdown de seleção de modelo disponível na tela de upload e nas configurações
  - [ ] Modelos disponíveis da Anthropic: `claude-opus-4-5`, `claude-sonnet-4-5`, `claude-haiku-4-5`
  - [ ] Modelos disponíveis da OpenAI: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`
  - [ ] O modelo selecionado é salvo como preferência e mantido para os próximos uploads
  - [ ] Ao lado de cada modelo, exibir indicação de custo estimado: "Mais preciso", "Equilibrado", "Mais econômico"
  - [ ] A chave de API correspondente ao provedor selecionado deve estar configurada nas variáveis de ambiente

#### RF-04 [P0] — Análise do documento por IA
- **Descrição:** O texto extraído é enviado à API do modelo selecionado para análise. A IA retorna os campos estruturados da licitação em formato JSON, usando o prompt especializado em licitações públicas brasileiras.
- **Critérios de aceitação:**
  - [ ] O texto é enviado à API do modelo configurado com o prompt do Agente Analisador (seção 9)
  - [ ] Exibe indicador visual: "Analisando edital com IA..."
  - [ ] Se a IA não encontrar um campo, o campo correspondente fica em branco (null) — o sistema nunca inventa informação
  - [ ] Se a chamada à API falhar (timeout, erro de rede), exibe: "Falha na análise por IA. Verifique sua conexão e tente novamente."
  - [ ] Se o saldo de tokens/créditos estiver esgotado, exibe: "Créditos insuficientes na API de IA. Recarregue seu saldo e tente novamente."
  - [ ] O processo não salva nenhum dado se a IA retornar erro

#### RF-05 [P0] — Gravação da licitação no banco
- **Descrição:** Após o retorno da IA, os dados são validados e salvos no banco de dados com status inicial "ANALISAR".
- **Critérios de aceitação:**
  - [ ] Todos os campos retornados pela IA são mapeados para a tabela `licitacoes`
  - [ ] O status é **sempre** definido como "ANALISAR" independentemente do que a IA retornar
  - [ ] A data de cadastro é preenchida automaticamente com o momento atual
  - [ ] Após salvar, o usuário é redirecionado para a tela de detalhe da licitação recém-criada
  - [ ] Exibe toast de sucesso: "Licitação cadastrada com sucesso!"
  - [ ] Se houver erro ao salvar no banco, exibe: "Erro ao salvar a licitação. Tente novamente."

---

### 3.2 Épico: Listagem e Filtros

#### RF-06 [P0] — Listagem de licitações por status
- **Descrição:** A tela principal exibe todas as licitações cadastradas, com abas para cada status disponível.
- **Critérios de aceitação:**
  - [ ] Exibe abas: Todas, Analisar, Participar, Descartada, Vencedor, Perdida, Suspensa
  - [ ] Cada aba mostra o número de licitações naquele status entre parênteses
  - [ ] A aba "Todas" é a padrão ao abrir a tela
  - [ ] A listagem é ordenada por data de cadastro, mais recentes primeiro
  - [ ] Cada item da lista exibe: órgão, objeto (resumido em até 2 linhas), data de abertura e badge de status
  - [ ] A lista atualiza automaticamente após incluir ou excluir uma licitação

#### RF-07 [P0] — Busca e filtros adicionais
- **Descrição:** O usuário pode buscar licitações por texto e filtrar por campos específicos.
- **Critérios de aceitação:**
  - [ ] Campo de busca textual que filtra por órgão, objeto e número do edital simultaneamente
  - [ ] A busca ocorre em tempo real conforme o usuário digita
  - [ ] Filtro por modalidade (dropdown com as modalidades presentes no banco)
  - [ ] Filtro por intervalo de data de abertura (data inicial e data final)
  - [ ] Botão "Limpar filtros" que restaura a listagem completa

---

### 3.3 Épico: Visão Detalhada e Edição

#### RF-08 [P0] — Tela de detalhe da licitação
- **Descrição:** Ao clicar em uma licitação na lista, o usuário acessa a tela com todos os campos preenchidos.
- **Critérios de aceitação:**
  - [ ] Exibe todos os campos do modelo de dados com seus valores atuais
  - [ ] Campos em branco (não encontrados pela IA) são exibidos com traço "—" ou campo vazio editável
  - [ ] Os itens (JSONB) são exibidos como tabela com colunas: lote, item, descrição, unidade, quantidade, valor unitário
  - [ ] Os documentos de habilitação (JSONB) são exibidos como lista numerada
  - [ ] O status atual é exibido com badge colorido no topo da página
  - [ ] Botão "Editar" habilitando edição de todos os campos

#### RF-09 [P0] — Edição de campos
- **Descrição:** O usuário pode editar qualquer campo da licitação manualmente e salvar as alterações.
- **Critérios de aceitação:**
  - [ ] Ao clicar em "Editar", todos os campos se tornam editáveis
  - [ ] O campo de status é um dropdown com as 6 opções disponíveis
  - [ ] O campo de data aceita seleção via calendário
  - [ ] O campo `registro_preco` é um toggle (sim/não)
  - [ ] Botão "Salvar" persiste as alterações no banco
  - [ ] Botão "Cancelar" descarta as alterações e restaura os valores anteriores
  - [ ] Toast de sucesso após salvar: "Alterações salvas com sucesso!"
  - [ ] Toast de erro se falhar: "Erro ao salvar. Tente novamente."

#### RF-10 [P0] — Alteração rápida de status
- **Descrição:** O usuário pode alterar o status diretamente na lista ou no detalhe sem entrar em modo de edição completo.
- **Critérios de aceitação:**
  - [ ] Na lista, cada licitação tem um dropdown de status alterável diretamente
  - [ ] Na tela de detalhe, dropdown de status proeminente no topo
  - [ ] A alteração é salva imediatamente ao selecionar o novo status
  - [ ] Toast: "Status atualizado para [novo status]"
  - [ ] Toda licitação nova entra **sempre** como "ANALISAR", sem exceção

#### RF-11 [P0] — Exclusão de licitação
- **Descrição:** O usuário pode excluir uma licitação do sistema com confirmação.
- **Critérios de aceitação:**
  - [ ] Botão "Excluir" (ícone de lixeira) disponível na tela de detalhe
  - [ ] Abre modal de confirmação: "Tem certeza que deseja excluir esta licitação? Esta ação não pode ser desfeita."
  - [ ] Ao confirmar, a licitação é removida e o usuário é redirecionado para a listagem
  - [ ] Toast: "Licitação excluída com sucesso."
  - [ ] Em caso de erro: "Erro ao excluir. Tente novamente."

---

### 3.4 Épico: Dashboard

#### RF-12 [P0] — Painel de indicadores
- **Descrição:** A tela de dashboard exibe visão consolidada do desempenho nas licitações.
- **Critérios de aceitação:**
  - [ ] Card: total de licitações cadastradas
  - [ ] Card: total por status (Analisar, Participar, Vencedor, Perdida, Descartada, Suspensa)
  - [ ] Card: taxa de vitória (Vencedor ÷ (Vencedor + Perdida) × 100, exibido em %)
  - [ ] Gráfico de barras: volume de licitações cadastradas por mês (últimos 12 meses)
  - [ ] Gráfico de pizza/donut: distribuição por status atual
  - [ ] Todos os indicadores calculados em tempo real a partir do banco

#### RF-13 [P1] — Filtro de período no dashboard
- **Critérios de aceitação:**
  - [ ] Filtro: últimos 30 dias, últimos 90 dias, este ano, todos
  - [ ] Ao selecionar, todos os cards e gráficos atualizam
  - [ ] Padrão: "todos"

---

### 3.5 Épico: Feedbacks e Comunicação de Erros

#### RF-14 [P0] — Sistema de notificações
- **Descrição:** Toda ação que pode falhar deve comunicar o resultado ao usuário com mensagens claras e amigáveis.
- **Critérios de aceitação:**
  - [ ] Toasts de sucesso: verdes, canto superior direito, desaparecem em 3 segundos
  - [ ] Toasts de erro: vermelhos, permanecem por 6 segundos ou até o usuário fechar
  - [ ] Indicadores de loading exibidos inline na área da ação em progresso
  - [ ] Nenhuma ação crítica (upload, análise, exclusão) acontece sem feedback visual
  - [ ] Erros técnicos traduzidos para linguagem amigável — nunca exibir stack trace ou código de erro

---

## 4. Requisitos Não-Funcionais

### 4.1 Performance
- Upload de arquivo de até 5MB deve completar em menos de 5 segundos
- Análise pela IA pode levar de 10 a 60 segundos (varia por modelo e tamanho do documento) — o sistema informa ao usuário durante todo esse tempo
- Listagem de até 500 licitações deve carregar em menos de 2 segundos
- Dashboard deve funcionar com até 1.000 registros sem degradação perceptível

### 4.2 Segurança
- **MVP:** sem autenticação — acesso direto (uso interno)
- **Pós-MVP:** autenticação via Supabase Auth com email e senha; perfis admin e operador
- Chaves de API (Anthropic e OpenAI) armazenadas **exclusivamente** em variáveis de ambiente no servidor — nunca expostas no frontend
- Toda comunicação via HTTPS
- Pós-MVP: RLS (Row Level Security) no Supabase por perfil de usuário

### 4.3 Usabilidade
- Interface responsiva: funciona em desktop (prioridade) e tablet
- Feedback visual para toda ação que leva mais de 1 segundo
- Mensagens de erro em português, claras e orientadas à ação
- Formulários com validação inline
- Navegação principal sempre visível na sidebar

### 4.4 Disponibilidade
- Hospedagem na Vercel + Supabase — ambos com uptime 99,9% por SLA
- Backups automáticos do banco pelo Supabase (diário)
- Em caso de indisponibilidade da API de IA, o sistema falha graciosamente — exibe erro e permite tentar novamente, sem perder dados

---

## 5. Especificações Técnicas

### 5.1 Stack tecnológica

| Tecnologia | Versão | Por que foi escolhida |
|---|---|---|
| Next.js (App Router) | 14+ | Framework completo com frontend e API no mesmo projeto |
| TypeScript | 5+ | Tipagem que previne erros antes de rodar o código |
| Tailwind CSS | 3+ | Estilização rápida diretamente no HTML |
| Shadcn/ui | latest | Componentes prontos com visual profissional |
| Supabase | latest | Banco de dados PostgreSQL + autenticação + storage |
| pdf-parse | latest | Extração de texto de PDFs digitais |
| mammoth | latest | Extração de texto de arquivos Word (.doc e .docx) |
| Anthropic SDK | latest | SDK oficial para chamadas à API Claude (Anthropic) |
| OpenAI SDK | latest | SDK oficial para chamadas à API GPT (OpenAI) |
| Recharts | latest | Gráficos para React — usado no dashboard |
| Framer Motion | 11+ | Animações suaves nos componentes de feedback |
| Lucide React | latest | Ícones consistentes e leves |
| Sonner | latest | Componente de toast moderno e acessível |

### 5.2 Arquitetura

```
[Navegador do Usuário]
        ↓ acessa
[Next.js — Frontend (React)]
        ↓ faz requisições para
[Next.js — API Routes (Servidor)]
        ↓                         ↓
[Supabase]               [IA — Provedor selecionado]
[PostgreSQL]             ┌─────────────────────────┐
[Banco de dados]         │  Anthropic (Claude)  OU  │
                         │  OpenAI (GPT)            │
                         └─────────────────────────┘
```

**Fluxo de upload:**
1. Navegador envia o arquivo para a API Route `/api/licitacoes/upload`
2. API Route detecta o formato e extrai o texto (`pdf-parse` para PDF, `mammoth` para Word, leitura direta para TXT)
3. Texto é enviado para a API do modelo selecionado com o prompt do Agente Analisador
4. Resposta JSON da IA é validada e salva no Supabase com status "ANALISAR"
5. API Route retorna o ID da nova licitação para o frontend
6. Frontend redireciona para a tela de detalhe

### 5.3 Integrações externas

| Integração | O que faz | Como autentica | Custo estimado |
|---|---|---|---|
| Anthropic API | Analisa o documento e extrai campos estruturados (modelos Claude) | `ANTHROPIC_API_KEY` via variável de ambiente | Pay-per-use (~R$0,05 a R$0,50 por edital dependendo do modelo e tamanho) |
| OpenAI API | Analisa o documento e extrai campos estruturados (modelos GPT) | `OPENAI_API_KEY` via variável de ambiente | Pay-per-use (~R$0,05 a R$0,40 por edital dependendo do modelo) |
| Supabase | Banco de dados, autenticação futura | `SUPABASE_URL` + `SUPABASE_ANON_KEY` | Free tier cobre o MVP |
| Vercel | Hospedagem Next.js com deploy automático via GitHub | Configurado no painel da Vercel | Free tier cobre o MVP |

---

## 6. Modelo de Dados

### Tabela: licitacoes
**Propósito:** Armazena todas as licitações cadastradas, com dados extraídos pela IA e metadados de gestão.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | uuid | sim | Identificador único gerado automaticamente |
| numero_edital | text | não | Número do certame. Ex: "PE 001/2026" |
| numero_processo | text | não | Número do processo administrativo |
| orgao | text | não | Órgão promotor. Formato: "NOME - ESTADO". Ex: "CAMPINAS - SP" |
| modalidade | text | não | PREGÃO ELETRÔNICO \| PREGÃO PRESENCIAL \| DISPENSA DE LICITAÇÃO \| CREDENCIAMENTO |
| tipo_disputa | text | não | GLOBAL \| POR LOTE \| POR ITEM |
| modo_disputa | text | não | ABERTO \| ABERTO E FECHADO \| FECHADO E ABERTO \| FECHADO |
| registro_preco | boolean | não | true se for Sistema de Registro de Preços |
| data_abertura | date | não | Data da sessão pública. Formato: YYYY-MM-DD |
| data_hora_abertura | timestamp | não | Data e hora da sessão. Formato: YYYY-MM-DD HH:MM |
| objeto | text | não | Descrição literal do objeto conforme o edital |
| documentos_habilitacao | jsonb | não | Array de strings com os documentos de habilitação exigidos |
| itens | jsonb | não | Array de objetos com os itens licitados (lote, item, descrição, unidade, quantidade, valor_item) |
| status | text | sim | ANALISAR \| PARTICIPAR \| DESCARTADA \| VENCEDOR \| PERDIDA \| SUSPENSA. Padrão: ANALISAR |
| data_evento | text | não | Data de evento complementar (texto livre) |
| distancia_km | numeric | não | Distância em km até o local de execução/entrega |
| plataforma | text | não | Portal de compras. Ex: "BLL", "COMPRAS NET", "BNC" |
| regionalidade | text | não | NÃO \| SIM - PREFERÊNCIA REGIONAL \| SIM - PREFERÊNCIA LOCAL \| SIM - EXCLUSIVO REGIONAL \| SIM - EXCLUSIVO LOCAL |
| data_cadastro | timestamp | sim | Preenchido automaticamente com o momento da inclusão |

**Constraints:**
- `status` aceita apenas: ANALISAR, PARTICIPAR, DESCARTADA, VENCEDOR, PERDIDA, SUSPENSA
- `tipo_disputa` aceita apenas: GLOBAL, POR LOTE, POR ITEM

**Índices:**
- `idx_licitacoes_status` — busca por status
- `idx_licitacoes_data_abertura` — filtro e ordenação por data
- `idx_licitacoes_orgao` — busca por órgão
- `idx_licitacoes_itens` — índice GIN para busca dentro do JSONB

**Estrutura do campo `itens` (JSONB):**
```json
[
  {
    "lote": 1,
    "item": 1,
    "descricao": "Caneta esferográfica azul",
    "unidade": "unidade",
    "quantidade": 500,
    "valor_item": 1.50
  }
]
```

**Estrutura do campo `documentos_habilitacao` (JSONB):**
```json
[
  "Certidão Negativa de Débitos Federais",
  "Certidão Negativa de Débitos Estaduais",
  "Certificado de Regularidade do FGTS",
  "Balanço patrimonial do último exercício"
]
```

---

## 7. Fluxos Detalhados

### Fluxo 1: Inclusão de nova licitação via upload
**Ator:** Usuário (operador)
**Pré-condição:** O usuário tem acesso ao sistema e possui um documento válido (PDF, Word ou TXT)

1. Usuário clica em "Nova Licitação" na sidebar ou na listagem
2. Sistema exibe a tela de upload com área drag-and-drop, botão de seleção e dropdown de modelo de IA
3. Usuário seleciona o modelo de IA desejado (preferência salva do uso anterior é pré-selecionada)
4. Usuário arrasta o arquivo ou seleciona via browser
5. Sistema valida formato (PDF/Word/TXT) e tamanho (máx. 20MB)
6. Sistema exibe: "Extraindo texto do documento..." com spinner
7. Sistema extrai o texto conforme o formato do arquivo
8. Sistema exibe: "Analisando com IA..." com spinner
9. Sistema envia o texto para a API do modelo selecionado com o prompt do Agente Analisador
10. IA retorna JSON com os campos (campos não encontrados = null)
11. Sistema salva a licitação no banco com status "ANALISAR"
12. Toast verde: "Licitação cadastrada com sucesso!"
13. Redirecionamento automático para a tela de detalhe da licitação criada

**Tratamento de erros:**
- Passo 5 — formato inválido: erro inline "Formato não suportado. Envie PDF, Word ou TXT."
- Passo 5 — arquivo > 20MB: erro inline "Arquivo muito grande. Máximo: 20MB."
- Passo 7 — arquivo corrompido/sem texto: toast vermelho "Não foi possível extrair o texto. Verifique se o arquivo não está corrompido ou protegido." Processo encerrado.
- Passo 9 — falha na API de IA: toast vermelho "Falha na análise por IA. Verifique sua conexão e tente novamente." Processo encerrado.
- Passo 9 — créditos insuficientes: toast vermelho "Créditos insuficientes na API de IA. Recarregue seu saldo e tente novamente."
- Passo 11 — erro no banco: toast vermelho "Erro ao salvar a licitação. Tente novamente."

---

### Fluxo 2: Alteração de status
**Ator:** Usuário
**Pré-condição:** Ao menos uma licitação cadastrada

1. Usuário vê a licitação na lista
2. Clica no dropdown de status ao lado da licitação
3. Sistema exibe as 6 opções de status
4. Usuário seleciona o novo status
5. Sistema salva imediatamente no banco
6. Toast verde: "Status atualizado para [novo status]"
7. Badge de status atualiza visualmente em tempo real

**Tratamento de erros:**
- Passo 5 — falha ao salvar: toast vermelho "Erro ao atualizar o status. Tente novamente." Status volta ao valor anterior visualmente.

---

### Fluxo 3: Edição de campos
**Ator:** Usuário
**Pré-condição:** Usuário está na tela de detalhe

1. Usuário clica em "Editar"
2. Sistema habilita todos os campos para edição
3. Botões "Salvar" e "Cancelar" aparecem no topo e rodapé
4. Usuário edita os campos desejados
5. Usuário clica em "Salvar"
6. Sistema valida (apenas `status` é obrigatório)
7. Sistema salva todas as alterações
8. Sai do modo de edição, exibe valores atualizados
9. Toast verde: "Alterações salvas com sucesso!"

**Tratamento de erros:**
- Passo 7 — falha: toast vermelho "Erro ao salvar. Tente novamente." Modo de edição permanece.
- Cancelar: campos voltam ao original, modo de edição encerrado sem salvar.

---

### Fluxo 4: Exclusão de licitação
**Ator:** Usuário
**Pré-condição:** Usuário na tela de detalhe

1. Usuário clica no ícone de lixeira
2. Modal: "Tem certeza que deseja excluir esta licitação? Esta ação não pode ser desfeita."
3. Usuário clica em "Sim, excluir"
4. Sistema remove o registro do banco
5. Redireciona para a listagem
6. Toast verde: "Licitação excluída com sucesso."

**Tratamento de erros:**
- Passo 4 — falha: toast vermelho "Erro ao excluir. Tente novamente." Modal fecha, usuário permanece no detalhe.

---

## 8. Design e Interface

### 8.1 Identidade visual

> **Nota:** O design system definitivo será fornecido após o MVP e substituirá estas definições provisórias.

- **Cor primária:** `#1B3A5C` — azul escuro institucional (navbar, cabeçalhos)
- **Cor de ação:** `#2E7EB8` — azul médio (botões primários, links, ícones ativos)
- **Destaque:** `#E8643A` — laranja (badges de ação, alertas)
- **Background:** `#F8FAFC` — cinza muito claro
- **Superfície (cards):** `#FFFFFF`
- **Texto principal:** `#1A1A2E`
- **Texto secundário:** `#6B7280`
- **Sucesso:** `#16A34A`
- **Erro:** `#DC2626`
- **Fonte:** Inter (Google Fonts)

### 8.2 Cores dos badges de status

| Status | Cor | Hex |
|---|---|---|
| ANALISAR | Amarelo | `#EAB308` |
| PARTICIPAR | Roxo | `#7C3AED` |
| DESCARTADA | Cinza | `#6B7280` |
| VENCEDOR | Verde | `#16A34A` |
| PERDIDA | Vermelho | `#DC2626` |
| SUSPENSA | Laranja | `#E8643A` |

### 8.3 Componentes principais

| Componente | Onde aparece | Comportamento |
|---|---|---|
| Sidebar | Todas as páginas | Fixa à esquerda: Dashboard, Licitações, Nova Licitação |
| StatusBadge | Lista e detalhe | Badge colorido conforme tabela de cores acima |
| UploadZone | Nova licitação | Drag-and-drop com feedback visual de hover e loading |
| ModelSelector | Nova licitação | Dropdown para escolha do modelo de IA e provedor |
| LicitacaoCard | Listagem | Órgão, objeto resumido, data de abertura, badge de status |
| ConfirmModal | Exclusão | Modal com título, mensagem e botões cancelar/confirmar |
| Toast | Global | Notificação no canto superior direito (Sonner) |
| StatusDropdown | Lista e detalhe | Dropdown inline para troca rápida de status |
| DataTable | Itens da licitação | Lote, item, descrição, unidade, quantidade, valor |

### 8.4 Mapa de páginas

| Rota | Nome | Descrição | Acesso |
|---|---|---|---|
| `/` | Redirect | Redireciona para `/dashboard` | Público (MVP) |
| `/dashboard` | Dashboard | Cards de indicadores e gráficos | Público (MVP) |
| `/licitacoes` | Licitações | Listagem com abas, busca e filtros | Público (MVP) |
| `/licitacoes/nova` | Nova Licitação | Upload + seleção de modelo de IA | Público (MVP) |
| `/licitacoes/[id]` | Detalhe | Todos os campos, edição e exclusão | Público (MVP) |
| `/login` | Login | Autenticação — Pós-MVP | Futuro |

---

## 9. IA e Prompts

### 9.1 Agente: Analisador de Edital

- **Papel:** Extrair informações estruturadas de editais e termos de referência a partir do texto bruto do documento, com conhecimento especializado em licitações públicas brasileiras e na Lei nº 14.133/2021
- **Quando é acionado:** Imediatamente após a extração bem-sucedida do texto do documento
- **Input:** Texto bruto completo extraído do arquivo
- **Output esperado:** JSON válido e completo conforme o schema definido. Campos não encontrados = `null`. Nunca inventar informação.

### 9.2 Modelos disponíveis e configuração

**Provedores e modelos suportados:**

| Provedor | Modelo | Identificador | Perfil de uso |
|---|---|---|---|
| Anthropic | Claude Opus 4.5 | `claude-opus-4-5` | Mais preciso — editais complexos, muitos itens |
| Anthropic | Claude Sonnet 4.5 | `claude-sonnet-4-5` | Equilibrado — recomendado para uso geral |
| Anthropic | Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | Mais econômico — editais simples |
| OpenAI | GPT-4o | `gpt-4o` | Alta precisão — boa alternativa ao Opus |
| OpenAI | GPT-4o Mini | `gpt-4o-mini` | Econômico — editais simples |
| OpenAI | GPT-4 Turbo | `gpt-4-turbo` | Precisão com janela de contexto longa |

**Variáveis de ambiente necessárias:**
```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

**Instrução de implementação:** O sistema deve detectar o provedor pelo modelo selecionado e usar o SDK correspondente (Anthropic SDK ou OpenAI SDK). O `max_tokens` deve ser `4096` para garantir retorno completo de editais com muitos itens.

### 9.3 Prompt completo do Agente Analisador

O prompt abaixo é o prompt de sistema (`system`) para a chamada à API. O texto do edital deve ser inserido no lugar de `{{TEXTO}}` no bloco `<texto_licitacao>`.

```xml
<system>

<papel>
Você é um Analista Sênior de Licitações Públicas, especialista em interpretação de
Editais, Termos de Referência e Anexos, com profundo conhecimento da Lei nº 14.133/2021
e das práticas administrativas brasileiras.
</papel>

<objetivo>
Extrair informações objetivas, literais e estruturadas a partir de textos oficiais de
licitações públicas e retornar EXCLUSIVAMENTE um JSON válido conforme o esquema definido.
</objetivo>

<proibicoes_absolutas>
NÃO invente informações.
NÃO faça suposições ou deduções além do texto.
NÃO escreva explicações, comentários ou markdown fora do JSON.
NÃO normalize, reformule ou complete textos técnicos.
NÃO utilize conhecimento externo ao texto fornecido.
NÃO misture conceitos jurídicos distintos.
Quando uma informação não estiver clara e explicitamente presente, retorne null.
Se houver conflito ou ambiguidade entre trechos, retorne null.
</proibicoes_absolutas>

<regras_gerais_de_extracao>
- Use somente dados explicitamente identificáveis no texto.
- Preserve a ordem dos lotes e itens conforme aparecem no edital.
- Respeite rigorosamente os valores de ENUMs definidos para cada campo.
- Retorne APENAS JSON válido — nenhum texto antes ou depois.
</regras_gerais_de_extracao>

</system>

<user>

Analise o texto completo da licitação fornecido ao final e retorne EXCLUSIVAMENTE um
JSON válido seguindo o esquema e as regras abaixo.

<campo name="numero_edital">
Número do certame (Pregão, Dispensa ou Credenciamento).
Priorize sempre o número do Pregão ou da Dispensa.
</campo>

<campo name="numero_processo">
Número do Processo Administrativo do certame.
</campo>

<campo name="orgao">
Órgão promotor do certame. Formato obrigatório: "ORGÃO - ESTADO" (letras maiúsculas,
separador " - ", estado no formato de sigla: SP, PR, MG etc.).

  <regras_de_extracao>
    <caso condicao="orgao_promotor == PREFEITURA MUNICIPAL">
      1. Identificar o nome da cidade.
      2. Remover OBRIGATORIAMENTE: PREFEITURA MUNICIPAL, MUNICÍPIO DE,
         PREFEITURA DA ESTÂNCIA TURÍSTICA DE, PREFEITURA MUNICIPAL DA ESTÂNCIA TURÍSTICA DE,
         ESTÂNCIA TURÍSTICA DE
      3. Resultado: NOME DA CIDADE - ESTADO
    </caso>
    <caso condicao="orgao_promotor != PREFEITURA MUNICIPAL">
      1. Usar denominação institucional completa exatamente como aparece no edital.
      2. Remover apenas: PODER EXECUTIVO, ADMINISTRAÇÃO PÚBLICA
      3. Manter siglas oficiais (UFPR, FUNPAR, SESC, SENAI etc.)
      4. Resultado: NOME COMPLETO DO ÓRGÃO - ESTADO
    </caso>
    <caso condicao="estado_nao_identificado_no_nome">
      Buscar no endereço institucional ou corpo do edital. Se não identificar → null.
    </caso>
  </regras_de_extracao>

  <proibicoes_especificas_orgao>
  NÃO abrevie nomes de cidades. NÃO invente estados.
  NÃO duplique o nome do órgão. NÃO retorne apenas a cidade sem o estado.
  </proibicoes_especificas_orgao>
</campo>

<campo name="modalidade">
Valores permitidos (use EXATAMENTE um):
PREGÃO ELETRÔNICO | PREGÃO PRESENCIAL | DISPENSA DE LICITAÇÃO | CREDENCIAMENTO
</campo>

<campo name="modo_disputa">
Normalize gênero: ABERTA → ABERTO, FECHADA → FECHADO.
Valores permitidos (use EXATAMENTE um):
ABERTO | ABERTO E FECHADO | FECHADO E ABERTO | FECHADO
</campo>

<campo name="tipo_disputa">
ATENÇÃO: "por grupo" equivale a "POR LOTE".
Valores permitidos (use EXATAMENTE um):
GLOBAL | POR LOTE | POR ITEM
</campo>

<campo name="registro_preco">
Valores permitidos: true | false
</campo>

<campo name="data_abertura">Formato: YYYY-MM-DD</campo>

<campo name="data_hora_abertura">Formato: YYYY-MM-DD HH:MM</campo>

<campo name="objeto">
Descrição literal do objeto, exatamente como consta no edital.
</campo>

<campo name="data_evento">
Somente se explicitamente mencionada. Texto livre.
</campo>

<campo name="plataforma">
Nome abreviado em LETRAS MAIÚSCULAS. Sem links ou URLs.
Exemplos: BLL | BNC | COMPRAS NET | LICITAR DIGITAL | SCPI FIORILLI
Use E-MAIL somente quando a proposta for enviada por e-mail.
</campo>

<campo name="regionalidade">
Só marque SIM se houver declaração expressa no texto.
Preferência por ME/EPP NÃO deve ser considerada aqui.
Valores permitidos (use EXATAMENTE um):
NÃO | SIM - PREFERÊNCIA REGIONAL | SIM - PREFERÊNCIA LOCAL | SIM - EXCLUSIVO REGIONAL | SIM - EXCLUSIVO LOCAL
</campo>

<campo name="itens">
Lista dos itens/lotes conforme o edital.
NÃO altere descrições, valores ou unidades.
Numeração: somente números (1, 2, 3...), sem texto.
</campo>

<campo name="documentos_habilitacao">
Lista única de todos os documentos de habilitação (Array de Strings).
Reúna todos os tópicos (Jurídica, Fiscal, Financeira etc.) em uma lista única.
Descrições curtas e literais.
</campo>

<formato_json>
{
  "numero_edital": "" | null,
  "numero_processo": "" | null,
  "orgao": "" | null,
  "modalidade": "" | null,
  "tipo_disputa": "" | null,
  "registro_preco": true | false,
  "modo_disputa": "" | null,
  "data_abertura": "YYYY-MM-DD" | null,
  "data_hora_abertura": "YYYY-MM-DD HH:MM" | null,
  "objeto": "" | null,
  "data_evento": "" | null,
  "plataforma": "" | null,
  "regionalidade": "" | null,
  "itens": [
    {
      "lote": 0 | null,
      "item": 0 | null,
      "descricao": "",
      "unidade": "" | null,
      "quantidade": 0 | null,
      "valor_item": 0.00 | null
    }
  ],
  "documentos_habilitacao": []
}
</formato_json>

<texto_licitacao>
{{TEXTO}}
</texto_licitacao>

</user>
```

> **Instrução de implementação:** Substitua `{{TEXTO}}` pelo conteúdo extraído do documento. Para modelos OpenAI, use o campo `content` na mensagem `user` com o mesmo prompt. O campo `system` da API da OpenAI deve receber a parte `<system>` do prompt acima.

---

## 10. Segurança e LGPD

### 10.1 Dados sensíveis coletados

| Dado | Por que coleta | Como protege | Retenção |
|---|---|---|---|
| Texto dos documentos | Necessário para análise por IA | Processado em memória, não armazenado | Não retido |
| Dados das licitações (órgão, objeto, datas, itens) | Core do produto | Armazenado no Supabase com acesso controlado | Indefinido — usuário controla |
| Chaves de API (Anthropic, OpenAI) | Autenticação com serviços de IA | Variável de ambiente no servidor | N/A — configuração |

### 10.2 Consentimento
No MVP, o sistema é de uso interno. Os dados inseridos são documentos públicos (editais publicados por órgãos governamentais). Não há coleta de dados pessoais de terceiros no MVP.

### 10.3 Direitos do titular (LGPD)
- **Exportar dados:** Pós-MVP — botão "Exportar CSV" na listagem
- **Corrigir dados:** Todos os campos são editáveis diretamente (RF-09)
- **Deletar registros:** Exclusão disponível para qualquer licitação (RF-11). Para apagar todos os dados, o administrador acessa o painel do Supabase diretamente

---

## 11. Plano de Execução

### 11.1 Sprints

MVP em 2 dias, dividido em 4 meio-períodos:

#### Meio-dia 1 — Fundação
**Objetivo:** Projeto criado, banco configurado e estrutura de navegação funcionando
**Entregas:**
- [ ] Projeto Next.js 14 com TypeScript e Tailwind inicializado
- [ ] Dependências instaladas: Shadcn/ui, Supabase SDK, Anthropic SDK, OpenAI SDK, pdf-parse, mammoth, Recharts, Sonner
- [ ] Variáveis de ambiente configuradas (`.env.local`): `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- [ ] Supabase: tabela `licitacoes` criada com todos os campos, constraints e índices conforme seção 6
- [ ] Layout base com sidebar fixa e rotas `/dashboard`, `/licitacoes`, `/licitacoes/nova`
- [ ] Página de listagem carregando dados reais do banco (pode estar vazia)

#### Meio-dia 2 — Upload e IA
**Objetivo:** Fluxo principal funcionando — upload resulta em licitação cadastrada com status ANALISAR
**Entregas:**
- [ ] Componente `UploadZone` com drag-and-drop e validação de formato/tamanho
- [ ] Componente `ModelSelector` com todos os modelos Anthropic e OpenAI
- [ ] API Route `/api/licitacoes/upload` com detecção de formato e extração de texto (pdf-parse / mammoth / TXT)
- [ ] Integração com Anthropic SDK e OpenAI SDK usando o prompt da seção 9.3
- [ ] Mapeamento do JSON retornado para o modelo da tabela `licitacoes`
- [ ] Gravação no banco com status "ANALISAR"
- [ ] Feedbacks de loading em cada etapa
- [ ] Tratamento de todos os erros com toasts
- [ ] Redirecionamento para detalhe após sucesso

#### Meio-dia 3 — Listagem, Detalhe e Edição
**Objetivo:** Usuário consegue visualizar, editar, mudar status e excluir licitações
**Entregas:**
- [ ] Listagem com abas por status e contadores
- [ ] Busca textual em tempo real
- [ ] Tela de detalhe com todos os campos (itens como tabela, docs como lista)
- [ ] Modo de edição com todos os campos editáveis
- [ ] StatusDropdown inline com salvamento imediato
- [ ] Modal de confirmação de exclusão
- [ ] Todos os toasts de feedback implementados
- [ ] Badges de status com as cores corretas (ANALISAR = amarelo)

#### Meio-dia 4 — Dashboard e Ajustes Finais
**Objetivo:** Dashboard funcionando e MVP pronto para uso
**Entregas:**
- [ ] Cards de indicadores: total, por status e taxa de vitória
- [ ] Gráfico de barras: licitações por mês (últimos 12 meses)
- [ ] Gráfico de donut: distribuição por status
- [ ] Filtro de período no dashboard
- [ ] Revisão geral de feedbacks e mensagens de erro
- [ ] Teste manual do fluxo completo com edital real em PDF, Word e TXT
- [ ] Deploy na Vercel

### 11.2 Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| PDF escaneado (imagem sem texto) | Alta | Alto | Informar na interface que apenas documentos com texto selecionável são suportados no MVP. Planejar OCR na v2. |
| IA retorna JSON mal formatado | Média | Alto | Implementar validação robusta do JSON antes de salvar. Tratar exceções e exibir erro amigável. |
| Arquivo .doc legado com estrutura incompatível | Média | Médio | Testar com vários formatos reais. Ter mensagem de erro clara orientando a converter para .docx ou PDF. |
| Custo da API de IA acima do esperado | Baixa | Médio | Monitorar no painel do provedor. Considerar limitar o texto às primeiras N páginas em editais muito longos. |
| Prazo de 2 dias insuficiente | Média | Baixo | Dashboard é P1 — se necessário, entregar na semana seguinte sem comprometer o fluxo principal. |

### 11.3 Critérios de "pronto"

Uma entrega só é considerada pronta quando:
- [ ] Funcionalidade implementada e testada manualmente com dados reais
- [ ] Todos os estados de loading e erro implementados para aquela funcionalidade
- [ ] Sem erros de TypeScript (`tsc --noEmit` passa)
- [ ] Sem erros no console do navegador em uso normal
- [ ] Commit no GitHub com mensagem descritiva
- [ ] CLAUDE.md atualizado com novas instruções se necessário

---

## 12. Glossário

### API
Interface que permite dois sistemas diferentes conversarem pela internet. A API da Anthropic e da OpenAI é o canal pelo qual o LicitaControl envia o texto do edital e recebe os dados estruturados de volta.

### API Key
Código secreto que identifica e autoriza o uso de uma API externa. Deve ser armazenada apenas no servidor, nunca exposta no código público ou no navegador.

### App Router
Forma moderna de organizar páginas e rotas em Next.js. As pastas dentro de `app/` definem automaticamente as URLs do sistema.

### Banco de dados
Sistema que armazena e organiza os dados de forma estruturada e persistente. O LicitaControl usa PostgreSQL via Supabase.

### Constraint
Regra obrigatória definida no banco de dados. Ex: o campo `status` só aceita os valores ANALISAR, PARTICIPAR, DESCARTADA, VENCEDOR, PERDIDA, SUSPENSA.

### Deploy
Publicar a versão mais recente do sistema para que os usuários possam acessar. No LicitaControl, feito na Vercel automaticamente a cada commit no GitHub.

### Drag-and-drop
Funcionalidade que permite arrastar um arquivo do computador e soltar na interface para fazer upload, sem precisar usar o botão de seleção.

### ENUM
Conjunto fixo de valores permitidos para um campo. Ex: o campo `modalidade` só aceita "PREGÃO ELETRÔNICO", "PREGÃO PRESENCIAL", "DISPENSA DE LICITAÇÃO" ou "CREDENCIAMENTO".

### Endpoint / API Route
Endereço no servidor que recebe e processa requisições. Ex: `/api/licitacoes/upload` recebe o arquivo, extrai o texto e chama a IA.

### Frontend / Backend
Frontend é a interface visual que o usuário vê. Backend é o código que roda no servidor, invisível ao usuário — regras de negócio, banco de dados e integrações.

### JSONB
Tipo de campo do PostgreSQL que armazena dados estruturados flexíveis (listas, objetos). Usado nos campos `itens` e `documentos_habilitacao` porque cada edital pode ter número variável de itens.

### LGPD
Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018). Regula como empresas coletam, armazenam e utilizam dados pessoais no Brasil.

### mammoth
Biblioteca Node.js que lê arquivos Word (.doc e .docx) e extrai o conteúdo textual de forma programática.

### Modelo de IA
Versão específica de um sistema de inteligência artificial. No LicitaControl, o usuário pode escolher entre modelos da Anthropic (Claude) e da OpenAI (GPT), cada um com diferentes níveis de precisão e custo.

### MVP
Minimum Viable Product — a versão mais enxuta do produto que já funciona e entrega valor real. O MVP do LicitaControl é o que será desenvolvido nos 2 dias iniciais.

### pdf-parse
Biblioteca Node.js que lê arquivos PDF e extrai o texto. Funciona apenas com PDFs digitais (onde o texto é selecionável) — não funciona com PDFs de imagens escaneadas.

### Prompt
Instrução enviada a um modelo de IA para definir como ele deve se comportar e o que deve fazer. O prompt do LicitaControl instrui a IA a atuar como Analista Sênior de Licitações e retornar um JSON estruturado.

### RLS (Row Level Security)
Mecanismo do banco que define quais linhas cada usuário pode ver ou modificar. Será ativado no pós-MVP com o sistema de login.

### SDK
Software Development Kit — conjunto de ferramentas prontas para usar uma API. O Anthropic SDK e o OpenAI SDK simplificam as chamadas às APIs de IA.

### Sprint
Ciclo de desenvolvimento com duração e objetivo definidos. No LicitaControl, cada sprint é um meio-dia com entregas específicas.

### Supabase
Plataforma que oferece banco de dados PostgreSQL gerenciado, autenticação e storage. Elimina a necessidade de configurar um servidor próprio.

### Toast
Notificação pequena e temporária que aparece na tela para informar o resultado de uma ação (sucesso ou erro). Desaparece sozinha após alguns segundos.

### TypeScript
Linguagem baseada em JavaScript com tipagem estática — o editor avisa sobre erros antes de rodar o código.

### UUID
Identificador único universal gerado automaticamente para cada registro no banco. Garante que dois registros nunca terão o mesmo ID.

### Variável de ambiente
Configuração sensível (como chaves de API) armazenada fora do código, em `.env.local`. Nunca vai para o GitHub e nunca é exposta ao navegador.

### Vercel
Plataforma de hospedagem para Next.js com deploy automático via GitHub. O free tier cobre o MVP.

---

## Próximo passo

PRD completo. Para iniciar o desenvolvimento:

1. Instale o Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Crie a pasta do projeto e acesse-a no terminal
3. Rode `claude` para iniciar o Claude Code
4. Use `/init` para criar o arquivo `CLAUDE.md` e cole este PRD como contexto
5. Comece pelo **Meio-dia 1 — Fundação**, entrega por entrega
6. Após o MVP, forneça o design system para aplicar a identidade visual definitiva
