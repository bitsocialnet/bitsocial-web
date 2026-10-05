# Surpresas conhecidas

Este arquivo registra pontos de confusão específicos deste repositório que já causaram erros de agentes.

## Critérios de entrada

Adicione uma entrada apenas se todos os itens abaixo forem verdadeiros:

- É específico deste repositório (não é um conselho genérico).
- É provável que volte a acontecer com agentes futuros.
- Tem uma mitigação concreta que pode ser seguida.

Na dúvida, pergunte ao desenvolvedor antes de adicionar uma entrada.

## Modelo de entrada

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Entradas

### Domínios de produção de apps na Vercel podem voltar a apontar para deploys do master no Git

- **Data:** 2026-04-28
- **Observado por:** Tommaso + Codex
- **Contexto:** Verificação dos espelhos dos apps Seedit e 5chan no diretório de apps do Bitsocial Web.
- **O que surpreendeu:** Os projetos `seedit` e `5chan` na Vercel tinham `gitProviderOptions.createDeployments = "enabled"`, então pushes para o `master` no GitHub eram promovidos aos domínios de produção, mesmo que a política do repositório espere que os espelhos de produção sirvam apenas artefatos de release.
- **Impacto:** Os selos de espelho verificado no diretório de apps podem se tornar falsos, porque os domínios de produção servem o commit de desenvolvimento mais recente em vez do ZIP de release do GitHub cujo hash de `index.html` está registrado em `about/src/lib/apps-data.ts`.
- **Mitigação:** Antes de adicionar ou atualizar metadados de verificação de espelho, inspecione o projeto na Vercel com `vercel api /v9/projects/<project-id>` e confirme `gitProviderOptions.createDeployments = "disabled"`. Publique o conteúdo do ZIP de release com `vercel deploy --prebuilt --prod` e use `seedit-omega.vercel.app` ou `5chan-omega.vercel.app` para deploys de desenvolvimento.
- **Status:** confirmado

### O Portless 0.11 reaproveita estado antigo de proxy a menos que o inicializador force HTTPS

- **Data:** 2026-04-28
- **Observado por:** Tommaso + Codex
- **Contexto:** Migração do fluxo normal do `yarn start` da antiga URL de proxy `http://bitsocial.localhost:1355` para `https://bitsocial.localhost`.
- **O que surpreendeu:** Mesmo com o `portless@0.11.1` instalado, o Portless reaproveitou o proxy HTTP existente em `~/.portless/proxy.port = 1355` e imprimiu a URL antiga com `:1355`.
- **Impacto:** Atualizar versões de pacotes e documentação não basta; o `yarn start` ainda pode anunciar e usar a URL antiga quando um colaborador tem estado antigo do Portless em execução.
- **Mitigação:** Mantenha os scripts de inicialização subindo explicitamente o proxy HTTPS do Portless na porta `443` antes de registrar as rotas do app, para que o fluxo de execução migre para longe do estado persistido em `1355` em vez de herdá-lo.
- **Status:** confirmado

### O Portless muda a URL local canônica do app

- **Data:** 2026-03-18
- **Observado por:** Codex
- **Contexto:** Verificação em navegador e fluxos de smoke test
- **O que surpreendeu:** A URL local padrão não é a porta habitual do Vite. O repositório espera `https://bitsocial.localhost` através do Portless, então checar `localhost:3000` ou `localhost:5173` pode atingir o app errado ou coisa nenhuma.
- **Impacto:** Verificações em navegador podem falhar ou validar o alvo errado mesmo com o servidor de desenvolvimento saudável.
- **Mitigação:** Use `https://bitsocial.localhost` primeiro. Só contorne isso com `PORTLESS=0 corepack yarn start` quando precisar explicitamente de uma porta direta do Vite.
- **Status:** confirmado

### Os hooks do Commitizen bloqueiam commits não interativos

- **Data:** 2026-03-18
- **Observado por:** Codex
- **Contexto:** Fluxos de commit conduzidos por agentes
- **O que surpreendeu:** O `git commit` aciona o Commitizen através do Husky e fica esperando entrada interativa em um TTY, o que trava shells de agente não interativos.
- **Impacto:** Agentes podem ficar parados indefinidamente durante o que deveria ser um commit comum.
- **Mitigação:** Use `git commit --no-verify -m "message"` para commits criados por agentes. Pessoas ainda podem usar `corepack yarn commit` ou `corepack yarn exec cz`.
- **Status:** confirmado

### O Corepack é necessário para não cair no Yarn classic

- **Data:** 2026-03-19
- **Observado por:** Codex
- **Contexto:** Migração do gerenciador de pacotes para o Yarn 4
- **O que surpreendeu:** A máquina ainda tem uma instalação global do Yarn classic no `PATH`, então rodar `yarn` puro pode resolver para a v1 em vez da versão fixada do Yarn 4.
- **Impacto:** Desenvolvedores podem burlar acidentalmente a fixação de gerenciador de pacotes do repositório e obter um comportamento de instalação ou uma saída de lockfile diferentes.
- **Mitigação:** Use `corepack yarn ...` nos comandos de shell, ou rode `corepack enable` antes para que o `yarn` puro resolva para a versão fixada do Yarn 4.
- **Status:** confirmado

### Nomes fixos de app do Portless colidem entre worktrees do Bitsocial Web

- **Data:** 2026-03-30
- **Observado por:** Codex
- **Contexto:** Rodar `yarn start` em um worktree do Bitsocial Web enquanto outro worktree já servia através do Portless
- **O que surpreendeu:** Usar o nome literal de app `bitsocial` do Portless em todos os worktrees faz a própria rota colidir, mesmo quando as portas por trás são diferentes, então o segundo processo falha porque `bitsocial.localhost` já está registrado.
- **Impacto:** Branches paralelos do Bitsocial Web podem se bloquear mutuamente, embora o Portless exista justamente para permitir que coexistam com segurança.
- **Mitigação:** Mantenha a inicialização do Portless por trás do `scripts/start-dev.mjs`, que agora usa uma rota `*.bitsocial.localhost` com escopo de branch fora do caso canônico e recorre a uma rota com escopo de branch quando o nome puro `bitsocial.localhost` já está ocupado.
- **Status:** confirmado

### A pré-visualização da documentação tinha a porta 3001 fixa no código

- **Data:** 2026-03-30
- **Observado por:** Codex
- **Contexto:** Rodar `yarn start` junto de outros repositórios e agentes locais
- **O que surpreendeu:** O comando de desenvolvimento da raiz rodava o workspace de documentação com `docusaurus start --port 3001`, então a sessão de desenvolvimento inteira falhava sempre que outro processo já ocupava a `3001`, mesmo com o app principal já usando o Portless.
- **Impacto:** O `yarn start` podia derrubar o processo web logo depois de ele subir, interrompendo trabalho local não relacionado por causa de uma colisão de porta da documentação.
- **Mitigação:** Mantenha a inicialização da documentação por trás do `yarn start:docs`, que agora usa o Portless mais o `scripts/start-docs.mjs` para respeitar uma porta livre injetada ou recorrer à próxima porta disponível quando executado diretamente.
- **Status:** confirmado

### O hostname fixo do Portless para a documentação estava embutido no código

- **Data:** 2026-04-03
- **Observado por:** Codex
- **Contexto:** Rodar `yarn start` em um worktree secundário do Bitsocial Web enquanto outro worktree já servia a documentação através do Portless
- **O que surpreendeu:** O `start:docs` ainda registrava o hostname literal `docs.bitsocial.localhost`, então o `yarn start` podia falhar mesmo que o app about já soubesse evitar colisões de rota do Portless para o seu próprio hostname.
- **Impacto:** Worktrees paralelos não conseguiam usar o comando de desenvolvimento da raiz de forma confiável, porque o processo da documentação saía primeiro e o `concurrently` então derrubava o resto da sessão.
- **Mitigação:** Mantenha a inicialização da documentação por trás do `scripts/start-docs.mjs`, que agora deriva o mesmo hostname do Portless com escopo de branch que o app about e injeta essa URL pública compartilhada no alvo do proxy de desenvolvimento `/docs`.
- **Status:** confirmado

### Shells de worktree podem não pegar a versão do Node fixada pelo repositório

- **Data:** 2026-04-03
- **Observado por:** Codex
- **Contexto:** Rodar `yarn start` em worktrees do Git, como `.claude/worktrees/*` ou checkouts de worktree irmãos
- **O que surpreendeu:** Alguns shells de worktree resolviam `node` e `yarn node` para o Node `25.2.1` do Homebrew mesmo com o repositório fixando `22.12.0` no `.nvmrc`, então o `yarn start` podia rodar silenciosamente os inicializadores de desenvolvimento sob o runtime errado.
- **Impacto:** O comportamento do servidor de desenvolvimento pode divergir entre o checkout principal e os worktrees, dificultando a reprodução de bugs e violando a toolchain Node 22 esperada pelo repositório.
- **Mitigação:** Mantenha os inicializadores de desenvolvimento por trás do `scripts/start-dev.mjs` e do `scripts/start-docs.mjs`, que agora se reexecutam sob o binário do Node do `.nvmrc` quando o shell atual está na versão errada. A configuração do shell ainda deve preferir `nvm use`.
- **Status:** confirmado

### Restos de `docs-site/` podem esconder a ausência do código-fonte da documentação após a refatoração

- **Data:** 2026-04-01
- **Observado por:** Codex
- **Contexto:** Limpeza do monorepo depois do merge que moveu o projeto Docusaurus de `docs-site/` para `docs/`
- **O que surpreendeu:** A pasta antiga `docs-site/` pode continuar em disco com arquivos obsoletos, porém importantes, como `i18n/`, mesmo depois de o repositório versionado ter migrado para `docs/`. Isso faz a refatoração parecer duplicada localmente e pode esconder o fato de que as traduções versionadas da documentação não foram de fato movidas para `docs/`.
- **Impacto:** Agentes podem apagar a pasta antiga achando que é "lixo" e perder acidentalmente a única cópia local das traduções da documentação, ou continuar editando scripts que ainda apontam para o caminho morto `docs-site/`.
- **Mitigação:** Trate `docs/` como o único projeto canônico de documentação. Antes de apagar quaisquer restos locais de `docs-site/`, restaure código versionado como `docs/i18n/` e atualize scripts e hooks para pararem de referenciar `docs-site`.
- **Status:** confirmado

### A pré-visualização multilíngue da documentação pode disparar o uso de RAM durante a verificação

- **Data:** 2026-04-01
- **Observado por:** Codex
- **Contexto:** Corrigir i18n da documentação, roteamento de locales e comportamento do Pagefind com `yarn start:docs` mais Playwright
- **O que surpreendeu:** O modo padrão de pré-visualização da documentação agora faz um build multilíngue completo mais a indexação do Pagefind antes de servir, e manter esse processo vivo junto de várias sessões do Playwright ou do Chrome pode consumir muito mais RAM do que um loop normal de desenvolvimento do Vite ou do Docusaurus em um único locale.
- **Impacto:** A máquina pode ficar sem memória, sessões de navegador podem travar, e execuções interrompidas podem deixar para trás servidores de documentação ou navegadores headless obsoletos consumindo memória.
- **Mitigação:** Para trabalho de documentação que não precisa verificar rotas de locale nem o Pagefind, prefira `DOCS_START_MODE=live yarn start:docs`. Use a pré-visualização multilíngue padrão apenas quando precisar validar rotas traduzidas ou o Pagefind. Mantenha uma única sessão do Playwright, feche sessões de navegador antigas antes de abrir novas e pare o servidor de documentação depois da verificação se não precisar mais dele.
- **Status:** confirmado

### O `translate-docs.py` pode deixar locales da documentação pela metade ou com alvos de link quebrados

- **Data:** 2026-04-06
- **Observado por:** Codex
- **Contexto:** Corrigir rotas e conteúdo localizados da documentação depois de o `yarn start:docs` servir páginas de detalhe em inglês ou falhar ao gerar a saída de locale
- **O que surpreendeu:** O pipeline de tradução da documentação tinha dois modos de falha específicos deste repositório ao mesmo tempo: o `scripts/translate-docs.py` só extraía um pequeno subconjunto das mensagens de `DocsHome` quando as chamadas `tr(...)` usavam formas que ele não sabia analisar, e o markdown traduzido em `docs/i18n/**` podia conter slugs traduzidos por máquina ou artefatos `ZXQPLACEHOLDER` dentro dos alvos de link.
- **Impacto:** Homepages localizadas podem cair silenciosamente para o inglês, páginas de detalhe localizadas podem aparecer sem tradução, e o `yarn docs:build` completo pode falhar por links de locale quebrados mesmo com a documentação de origem válida.
- **Mitigação:** Depois de alterar traduções da documentação ou regerar arquivos de locale, sempre rode `yarn docs:build` a partir da raiz do repositório, procure por `ZXQPLACEHOLDER` no markdown em `docs/i18n/**` e confirme que os links traduzidos ainda apontam para slugs canônicos como `/apps/5chan/` em vez de caminhos de URL traduzidos. Se o texto do `DocsHome` mudou, verifique se o `scripts/translate-docs.py` ainda extrai todas as mensagens `docs.home.*`.
- **Status:** confirmado

### As verificações sem JS do site about precisam usar a rota do Portless, não uma pré-visualização SSR isolada

- **Data:** 2026-04-12
- **Observado por:** Codex
- **Contexto:** Verificar o suporte sem JS do site `about/` a partir de um worktree de branch
- **O que surpreendeu:** Uma pré-visualização SSR isolada pode parecer saudável enquanto a rota real do Portless com escopo de branch ainda serve o app shell errado ou um processo mais antigo. Neste repositório, o contrato local de verdade é o hostname do Portless vindo do `yarn start`, e não um servidor de pré-visualização improvisado.
- **Impacto:** Agentes podem afirmar incorretamente que o suporte sem JS funciona, ou deixar passar regressões que só aparecem em `*.bitsocial.localhost`.
- **Mitigação:** Para verificação em navegador do `about/`, sempre suba o servidor local real com `yarn start` ou `yarn start:about` e teste primeiro a URL do Portless com escopo de branch. Se um hostname do Portless parecer obsoleto, investigue e pare o processo antigo antes de testar de novo.
- **Status:** confirmado

### O `chain/` estava invisível para o `yarn build:verify` e o `yarn doctor`

- **Data:** 2026-07-05
- **Observado por:** Codex
- **Contexto:** Verificar um diff restrito a chain/ depois que o workspace `chain/` (app Vite independente para `chain.bitsocial.net`) foi adicionado ao monorepo.
- **O que surpreendeu:** O `scripts/verify-build.mjs` só reconhecia os prefixos de caminho `about/`, `docs/` e `stats/`, então um diff restrito a chain/ imprimia "No targeted build checks matched the current diff" e não rodava build nenhum, mesmo com o `build:chain` já existindo no `package.json` da raiz. Separadamente, o `yarn doctor` estava fixo em `react-doctor about -y`, então mudanças de React em `chain/src` ficavam sem nenhuma cobertura do React Doctor.
- **Impacto:** Agentes que verificavam mudanças em chain precisavam saber chamar `yarn build:chain` diretamente em vez de confiar no `yarn build:verify`, e problemas de React em `chain/src` (efeitos, hooks, código morto) passavam despercebidos pelo `yarn doctor`.
- **Mitigação:** O `scripts/verify-build.mjs` agora tem um ramo para `chain/` espelhando o de `about/`, e `doctor` / `doctor:verbose` agora rodam `react-doctor --project about,chain -y` em uma única invocação. O `doctor:score` continua restrito a `about` porque `--score` silenciosamente não imprime nada quando combinado com `--project` para mais de um projeto; use `yarn react-doctor --project about,chain --verbose -y` (ou `--json`) se precisar de um score do chain.
- **Status:** confirmado

### O P2P no navegador roda sobre WebSockets seguros; o pkc-js nega WebRTC e WebTransport por padrão

- **Data:** 2026-08-02
- **Observado por:** Claude
- **Contexto:** Escrever textos de landing page e de documentação sobre como o P2P do Bitsocial funciona no navegador
- **O que surpreendeu:** O `@pkcprotocol/pkc-js` traz um connection gater padrão que rejeita dials de WebRTC e WebTransport no navegador — `dist/browser/helia/dial-transport-filter.js` exporta `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. O comentário no código-fonte dá o motivo: no navegador esses transportes acrescentam caminhos de estabelecimento de conexão longos e que falham com frequência (STUN/ICE, rotação de certhash) e deixam o carregamento lento, enquanto o WebSocket é direto e confiável. Todo peer ao vivo no painel de status P2P do blog aparece como "Secure WebSocket". O gater vive em `node_modules`, então nada no repositório dá qualquer pista sobre ele.
- **Impacto:** É muito fácil escrever texto público tecnicamente plausível, porém falso — por exemplo, creditar a chegada do WebTransport ao Baseline dos navegadores em março de 2026 como o que tornou possível o P2P do Bitsocial no navegador. Essa afirmação chegou à landing page, à tabela comparativa e a duas páginas de documentação antes de o desenvolvedor perceber. Afirmações erradas sobre arquitetura em páginas públicas são conferidas exatamente pelo público de desenvolvedores que o site quer alcançar.
- **Mitigação:** Nunca deduza quais transportes o Bitsocial usa a partir do que o libp2p ou a plataforma do navegador suportam em princípio. Consulte `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` para ver a lista de negação atual, confirme que não existe nenhum override de `connectionGater` em `about/src/` e leia os rótulos de transporte ao vivo no painel "P2P status" do blog antes de fazer qualquer afirmação pública. A mudança upstream que de fato destravou a publicação a partir do navegador foi a correção de seqno monotônico do gossipsub no `@libp2p/gossipsub` 15.0.21 (maio de 2026); o pkc-js hoje entrega a 16.0.4.
- **Status:** confirmado

### Links relativos `./page.md` em uma página de documentação não traduzida quebram todos os builds localizados

- **Data:** 2026-08-02
- **Observado por:** Claude
- **Contexto:** Adicionar uma página nova só em inglês, `docs/browser-p2p.md`, que apontava para documentação existente com `./peer-to-peer-protocol.md` e `./apps/5chan.md`
- **O que surpreendeu:** Cada locale em `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` espelha a árvore da documentação. Uma página nova ausente desses espelhos ainda é renderizada em todos os locales via fallback para o inglês, mas seus links markdown relativos deixam de resolver — o Docusaurus emite `/ar/browser-p2p/peer-to-peer-protocol.md/` e falha o build com "Docusaurus found broken links!". O ponto decisivo é que `yarn build:verify` e `yarn docs:build:verify` constroem apenas o `en` e passam sem erro; só um `yarn docs:build` completo revela o problema, e ele aborta no primeiro locale em ordem alfabética (`ar`).
- **Impacto:** Uma mudança na documentação pode passar por todas as verificações locais rápidas e ainda assim quebrar o build multilíngue de produção. A falha também parece não ter relação com a mudança, já que o erro aponta um caminho de locale que o autor nunca tocou.
- **Mitigação:** Em qualquer página de documentação que não esteja espelhada em `docs/i18n/**`, use links relativos à raiz (`/peer-to-peer-protocol/`, `/apps/5chan/`) em vez de links relativos `.md`; o Docusaurus acrescenta o prefixo do locale automaticamente. O `docs/build-your-own-client.md` é o exemplo existente. Rode um `yarn docs:build` completo — não apenas o `build:verify` — antes de entregar qualquer mudança que adicione ou aponte para uma página de documentação.
- **Status:** confirmado

### Execuções concorrentes do `update-translations.js` perdem chaves silenciosamente

- **Data:** 2026-08-02
- **Observado por:** Claude
- **Contexto:** Aplicar 26 chaves i18next traduzidas em todos os 36 locales por meio da skill `translate`
- **O que surpreendeu:** Cada invocação é um ciclo de ler-modificar-escrever sobre todos os 36 arquivos de locale, então duas invocações rodando ao mesmo tempo se sobrescrevem e uma chave desaparece sem nenhum erro. A skill `translate` instrui explicitamente a criar até 4 subagentes concorrentes, e cada um deles chamaria o script.
- **Impacto:** Falha em silêncio: chaves somem de locales arbitrários e o diff continua parecendo plausível.
- **Mitigação:** Nunca deixe subagentes tradutores escreverem arquivos de locale de forma concorrente — faça-os emitir apenas arquivos JSON de dicionário e depois aplique cada chave em série a partir do agente pai. Depois de aplicar, verifique programaticamente que cada chave existe em todos os 35 locales não ingleses e que nenhum valor é idêntico byte a byte ao original em inglês.
- **Status:** confirmado
- **Atualização (2026-08-10):** O script também resolvia seu destino como `path.join(process.cwd(), "public", "translations")`, então o comando documentado, rodado a partir da raiz do repositório, falhava com "Translations directory not found" e precisava ser executado a partir de `about/`. Agora ele resolve o workspace a partir do diretório atual ou da própria localização e funciona de qualquer lugar. A armadilha de concorrência descrita acima não mudou.

### Controles de anotação de desenvolvimento podem interceptar cliques automatizados

- **Contexto:** Os sites about e chain têm controles fixos no canto inferior direito, onde a barra de ferramentas do Agentation também aparece em desenvolvimento.
- **Mitigação:** `scripts/pw-session.sh open` registra `window.__NO_DEV_TOOLBAR__ = true` antes de recarregar a página. O inicializador do Agentation também respeita `__VISUAL_TESTING__` e `__PROFILING__`; a inspeção do código-fonte continua disponível de forma independente. Automações diretas de navegador precisam definir a mesma flag antes de carregar a aplicação.

### `skills add` instala as cópias do Codex e do Cursor no diretório `.agents/`, ignorado pelo Git

- **Data:** 2026-08-18
- **Observado por:** Tommaso + Claude
- **Contexto:** Instalação da skill `improve-threejs` de `millionco/react-doctor` com a CLI `skills` (`vercel-labs/skills`).
- **O que surpreendeu:** `npx skills add <repo> --skill <name> --agent codex` e `--agent cursor` gravam ambos em `.agents/skills/<name>/`, e não em `.codex/skills/` ou `.cursor/skills/`. O `AGENTS.md` proíbe um diretório `.agents/` no nível do repositório e o `.gitignore:29` o ignora, então as duas cópias ficam silenciosamente fora do controle de versão. Só `--agent claude-code` grava no `.claude/skills/` esperado. Além disso, a forma documentada separada por vírgulas (`--agent claude-code,codex,cursor`) falha com "Invalid agents" e não instala nada, embora cada nome seja válido isoladamente.
- **Impacto:** A instalação informa sucesso enquanto duas das três cópias das ferramentas vão parar em um lugar que nunca será commitado, então o Codex e o Cursor ficam silenciosamente sem a skill depois de um clone novo. A forma com vírgulas também pode produzir uma instalação que não faz nada, mas parece bem-sucedida.
- **Mitigação atual:** O repositório agora versiona `.agents/skills` como fonte canônica e gera as cópias do Claude com `yarn ai-workflow:sync`. A antiga proibição de `.agents` e a regra de ignore foram removidas. Não copie novas skills para três raízes independentes; depois de adicionar uma skill, verifique a paridade dos arquivos gerados e o catálogo do app.
- **Status:** confirmado
