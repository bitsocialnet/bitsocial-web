# Traduções

O site about usa JSON do i18next em `about/public/translations/{lang}/default.json`. As traduções de origem do Docusaurus ficam separadas, em `docs/i18n/`.

## Chaves do site about

Use `.agents/skills/translate/SKILL.md`. Descubra os locales atuais a partir do disco e preserve placeholders, marcação, termos técnicos e nomes de marcas. Em pedidos maiores, agentes filhos podem gerar mapas independentes, mas um único agente pai aplica em série cada gravação nos locales; o atualizador não tem trava de escrita.

Use um caminho de mapa exclusivo, pertencente à tarefa. Visualize com `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` e depois aplique com os mesmos argumentos e `--write`. Verifique a cobertura/os valores depois de gravar e remova apenas os mapas temporários pertencentes a esta tarefa.

Use `--delete` para remoções solicitadas. Inspecione os achados de `--audit --dry` antes de um `--audit --write` autorizado; chaves de tradução dinâmicas exigem revisão manual do código-fonte. Copie o inglês para todos os locales apenas no caso de um termo técnico, uma marca ou um placeholder.

## Páginas do Docusaurus

`scripts/translate-docs.py` é um gravador em massa para todas as páginas/locales e não tem filtro por arquivo; não o use para uma edição pontual de tradução. `scripts/check-docs-translations.py` é o verificador somente leitura e aceita `--locales` e `--paths`.

Mantenha blocos de código, links, código inline, endereços de contrato, títulos, tabelas e admonitions alinhados com a fonte em inglês. Resolva os erros do verificador; avisos `frontmatter-untranslated` para nomes de marcas são esperados. Siga o `docs/AGENTS.md` e faça o build pela raiz ao mudar o tema ou o comportamento de i18n da documentação, para que a saída estática e o Pagefind continuem alinhados.

## Revisão semântica opcional

Para chaves i18next selecionadas, use `scripts/jev/translation-README.md`. Para páginas de documentação, rode primeiro `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Isso exige uma seleção explícita de locales/páginas, roda o verificador estrutural e relata a revisão semântica como não verificada até que a inferência ao vivo seja habilitada. Adicione `--live` apenas com a autorização de provedor e o orçamento da tarefa; a configuração privada compartilhada da máquina fornece as credenciais e um modelo fixado. Variáveis de ambiente e `--model` podem sobrescrever essa configuração. O comando nunca edita traduções.

O adaptador de páginas preserva o contexto da página inteira e limita cada página a 24 KB e cada execução a 30 pares. Para páginas maiores, prepare pares de parágrafos de origem/tradução alinhados explicitamente para `translations.mjs --pairs`; não emparelhe parágrafos automaticamente pelo índice. Os resultados semânticos são consultivos: inspecione os problemas e as incertezas relatados e mantenha as verificações determinísticas de código, links e endereços.
