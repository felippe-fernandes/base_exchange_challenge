# BASE Exchange Challenge

Este repositorio contem a implementacao de um desafio tecnico para uma interface de gerenciamento de ordens focada em ativos financeiros. O projeto combina um frontend em Next.js com uma API mock local que suporta listagem de ordens, filtros, ordenacao, detalhes da ordem, execucoes e criacao de ordens com logica de matching.

## Stack

- Next.js 16
- React 19
- TypeScript
- TanStack Query
- TanStack Table
- Zustand
- Vitest + Testing Library
- Playwright
- `json-server` com logica customizada de matching e filtros

## Como rodar localmente

Esta e a secao mais importante para quem for avaliar ou revisar o desafio tecnico.

### Pre-requisitos

- Node.js 20+ recomendado
- npm

### Passo a passo

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo de ambiente local:

```bash
cp .env.example .env.local
```

Se voce estiver usando Windows PowerShell, tambem pode usar:

```powershell
Copy-Item .env.example .env.local
```

3. Gere os dados de seed:

```bash
npm run seed
```

O valor oficial padrao do seed e `1200`. Se quiser outra quantidade para testes locais, passe o valor dinamicamente:

```bash
npm run seed -- 10000
```

4. Inicie a API mock em um terminal:

```bash
npm run dev:api
```

A API sobe em:

```text
http://localhost:3001
```

5. Inicie o frontend em outro terminal:

```bash
npm run dev
```

6. Abra a aplicacao:

```text
http://localhost:3000
```

### Resumo rapido

Se as dependencias ja estiverem instaladas e o `.env.local` ja existir, o fluxo local fica assim:

```bash
npm run seed
npm run dev:api
npm run dev
```

### Fluxo recomendado para avaliacao

Se a ideia for revisar o desafio tecnico com o menor caminho possivel:

1. Rode `npm install`
2. Rode `npm run seed`
3. Rode `npm run dev:api`
4. Rode `npm run dev`
5. Abra `http://localhost:3000/orders`
6. Verifique o redirect automatico com `createdAt_gte`
7. Teste filtros, ordenacao, detalhes, criacao de ordem, settings e regeneracao do banco

## Variaveis de ambiente

O frontend usa `NEXT_PUBLIC_API_URL` para acessar a API.

Exemplo de `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Se essa variavel nao for definida, a aplicacao usa `http://localhost:3001`.

## Notas do desafio tecnico

Como esta entrega foi estruturada como um desafio tecnico, os pontos mais relevantes para avaliacao sao:

- como rodar localmente
- decisoes de design e tradeoffs
- comportamento da logica de matching no backend
- estrategia de testes

## Scripts disponiveis

- `npm run dev`: inicia a aplicacao Next.js
- `npm run dev:api`: inicia a API mock local
- `npm run seed`: regenera `server/db.json` com o valor oficial padrao de `1200` itens
- `npm run seed -- <count>`: regenera `server/db.json` com uma quantidade customizada para testes locais
- `npm run test`: roda o Vitest em modo watch
- `npm run test:run`: roda o Vitest uma vez
- `npm run test:e2e`: roda a suite E2E com Playwright
- `npm run test:e2e:ui`: abre a interface do Playwright
- `npm run build`: gera o build de producao
- `npm run lint`: executa o ESLint

## Funcionalidades principais

- Tabela de ordens com scroll infinito e paginacao no servidor
- Multi-sort e filtros por coluna
- Expansao de linha e dialog de detalhes da ordem
- Visualizacao de execucoes e historico de status
- Formulario de criacao de ordens com validacao
- Regeneracao do banco a partir do header
- Persistencia local das preferencias de usuario e da tabela

## Como usar o site

Esta secao foi escrita para ajudar quem estiver avaliando o desafio a navegar pela interface rapidamente.

### 1. Abrir a pagina de ordens

- acesse `http://localhost:3000/orders`
- se `createdAt_gte` nao estiver presente, a pagina faz redirect automatico e adiciona o inicio do dia atual
- isso foi feito para que a primeira tela mostre as ordens de hoje por padrao

### 2. Explorar a tabela principal

- a tabela carrega dados da API local e continua carregando mais linhas conforme o usuario rola a tela
- o rodape mostra `linhas carregadas / total de linhas encontradas`
- a URL reflete o estado atual da tabela, entao filtros e ordenacao podem ser compartilhados

### 3. Filtrar os dados

- use os botoes de filtro nos headers das colunas
- existem filtros de texto, checkbox, intervalo numerico e intervalo de data
- os filtros ativos aparecem acima da tabela e podem ser removidos individualmente ou limpos de uma vez
- todo o estado dos filtros fica codificado na URL

### 4. Ordenar e usar multi-sort

- clique no header de uma coluna ordenavel para ordenar por aquele campo
- clique novamente para mudar a direcao
- use `Shift + clique` para montar um multi-sort
- a ordenacao final fica persistida no param `sort`

### 5. Abrir detalhes da ordem

- clique esquerdo em uma linha para abrir o dialog de detalhes
- use as abas internas para ver historico de status e execucoes
- tambem e possivel expandir a linha inline para ver informacoes extras sem abrir o dialog completo

### 6. Usar o menu de contexto da linha

- clique com o botao direito em uma linha para abrir o menu de contexto
- por ele voce pode:
- `View Details`
- `Copy ID`
- `Cancel Order` quando a ordem ainda puder ser cancelada

### 7. Criar uma ordem

- clique em `New Order`
- preencha instrumento, lado, preco, moeda e quantidade
- envie o formulario e aguarde a confirmacao do servidor
- a nova ordem so aparece depois da confirmacao do backend

### 8. Regenerar o banco local

- clique em `Regenerate DB` no header
- confirme a acao
- escolha quantos itens deseja criar
- o valor oficial padrao e `1200`
- o intervalo permitido vai de `1200` a `100000`
- isso reescreve o `server/db.json` local e recarrega a interface

### 9. Alterar user settings

- clique em `Settings` no header
- escolha tema, moeda preferida, formato de data e formato de hora
- a moeda preferida vira o valor padrao no dialog de criacao de ordem
- as preferencias de data e hora afetam imediatamente como os timestamps sao exibidos na interface

## Comportamento da pagina de ordens

A pagina de ordens e dirigida por search params na URL, para que o estado atual da tabela possa ser compartilhado e restaurado.

Comportamento inicial:

- se `createdAt_gte` nao existir, a pagina faz redirect para `/orders` com `createdAt_gte` definido como o inicio do dia atual
- isso faz com que a experiencia padrao de avaliacao mostre primeiro as ordens de hoje
- o valor oficial padrao do seed e `1200` itens

Paginacao e carregamento:

- o carregamento das ordens usa `useInfiniteQuery`
- a tabela busca os dados por pagina na API e concatena as proximas paginas conforme o usuario navega
- o rodape mostra quantas linhas ja foram carregadas em relacao ao total de linhas encontradas

Filtros:

- os filtros ficam armazenados na URL
- filtros de texto usam query params diretos, como `status=open`
- filtros com varios valores usam valores separados por virgula no mesmo param
- filtros numericos usam `_gte` e `_lte`
- filtros de data tambem usam `_gte` e `_lte`
- valores compactos de data na URL sao normalizados antes da chamada para a API
- os filtros ativos aparecem acima da tabela como badges removiveis

Ordenacao:

- a ordenacao e controlada pelo servidor
- o param `sort` aceita multi-sort com campos separados por virgula
- campos descendentes usam o prefixo `-`
- exemplo: `sort=-createdAt,price`
- a prioridade do multi-sort segue a ordem dos campos dentro do param `sort`

Interacoes por linha:

- clique esquerdo abre o dialog de detalhes da ordem
- expandir a linha revela execucoes e historico de status
- clique com o botao direito abre um menu de contexto para a ordem selecionada
- o menu de contexto inclui `View Details` e `Copy ID`
- quando o status da ordem e `open` ou `partial`, o menu tambem inclui `Cancel Order`

Ferramentas no header:

- `Regenerate DB` abre um dialog de confirmacao e chama o endpoint local de reseed
- `Settings` permite trocar tema, moeda preferida, formato de data e formato de hora
- a moeda preferida e usada como valor padrao no dialog de criacao de ordem
- as preferencias de data e hora afetam como os timestamps sao exibidos na interface

## Estrutura do projeto

- `src/app`: rotas e shells de pagina
- `src/components`: componentes de UI, tabela, ordens e layout
- `src/hooks`: hooks de tabela, filtros, navegacao e ordens
- `src/lib`: client da API, formatadores, schemas, constantes e helpers
- `src/stores`: estado em Zustand para preferencias da tabela
- `server`: API mock, geracao de seed e logica de matching

## Notas sobre API e backend

A API local fica em [server/index.js](./server/index.js) e estende o `json-server` com endpoints customizados e regras de negocio.

Principais capacidades do backend:

- filtro de ordens por texto, multiplos valores, ranges numericos e datas
- ordenacao por varios campos
- criacao de ordem com matching contra ordens abertas do lado oposto
- geracao de execucoes
- geracao de historico de status
- regeneracao do banco via endpoint administrativo reutilizando o gerador de seed

Os dados de seed sao gerados por [server/seed.js](./server/seed.js) usando helpers em [server/seed-utils.cjs](./server/seed-utils.cjs). O valor oficial padrao e `1200`, e o script tambem aceita uma quantidade customizada, por exemplo `npm run seed -- 10000`.

O header inclui a acao "Regenerate DB". Ela abre um dialog de confirmacao onde voce pode escolher quantos itens deseja criar. O valor oficial padrao e `1200`, o intervalo permitido e de `1200` a `100000`, e o backend usa a mesma logica de seed usada por `npm run seed`.

## Decisoes de design

### Sem optimistic updates na criacao de ordens

Essa foi uma decisao intencional. Como ordens representam dados financeiros, a interface espera a confirmacao do servidor antes de mostrar a ordem final criada. Optimistic updates com React Query foram considerados, mas rejeitados nesse fluxo para evitar exibir operacoes financeiras nao confirmadas.

### Filtros de data amigaveis na URL

Os parametros de data usam formatos compactos na URL, como:

- `2026-03-28`
- `2026-03-28T05:00Z`

Esses valores sao convertidos e normalizados para ISO completo antes das chamadas para a API.

### Seed cobre 7 dias

As ordens do seed sao geradas entre o dia atual e 7 dias antes. A pagina de ordens aplica por padrao um filtro que mostra primeiro as ordens do dia atual.

### Customizacao local da tabela

As preferencias da tabela sao persistidas intencionalmente em local storage via Zustand:

- ordem das colunas
- ordenacao padrao
- quantidade de linhas por pagina

Isso permite personalizacao da tabela sem depender de um perfil de usuario no backend.

### User settings locais

As preferencias do usuario sao armazenadas intencionalmente em local storage:

- tema: `light`, `dark` ou `system`
- moeda preferida
- formato de data preferido
- formato de hora preferido

Essas preferencias afetam apenas apresentacao. Elas nao mudam o formato dos payloads da API e nao fazem conversao de moeda.

## Testes

O projeto inclui testes automatizados para:

- funcoes utilitarias
- helpers da API
- schemas
- comportamento da store em Zustand
- hooks
- componentes compartilhados de UI
- fluxos de ordens
- logica principal de matching e filtros no servidor
- fluxos E2E de navegador com Playwright

Rodar testes em watch:

```bash
npm run test
```

Rodar testes uma vez:

```bash
npm run test:run
```

Rodar testes E2E:

```bash
npm run test:e2e
```

Nota atual:

- a suite E2E com Playwright cobre os fluxos criticos da tela de ordens
- a suite automatizada completa passa
- os thresholds globais de cobertura configurados no Vitest ainda precisam de mais trabalho para atingir a meta definida

## Notas sobre documentacao

Os testes e a documentacao do README foram produzidos com apoio de ferramentas de IA, incluindo Codex e Claude, com revisao humana e decisoes finais aplicadas ao projeto.

## Outros idiomas

- English: [README.en.md](./README.en.md)
