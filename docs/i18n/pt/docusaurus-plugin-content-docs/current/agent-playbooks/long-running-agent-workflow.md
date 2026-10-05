# Trabalho de agente de longa duração

Use um estado de tarefa durável quando o trabalho precisar ser retomado ou passado adiante, ou quando uma única execução for longa o bastante para que a compactação de contexto possa perder o controle do trabalho restante. Tarefas pequenas não precisam de quadro nem de arquivo de progresso. Para trabalho compartilhado, mantenha um `feature-list.json` e um `progress.md` concisos em um `docs/agent-runs/<slug>/` específico da tarefa, usando modelos existentes quando ajudar.

Registre o resultado solicitado, o branch/worktree atual, a responsabilidade pelos arquivos, as mudanças concluídas, as verificações com seus resultados, os processos/sessões sob sua responsabilidade e o próximo passo pendente. Não armazene credenciais nem despejos arbitrários de código-fonte. Marque uma funcionalidade como concluída somente quando seus critérios de aceitação estiverem verificados.

Ao retomar, inspecione o estado do Git, o progresso mais recente e o código-fonte relevante antes de editar. Reaproveite recursos compatíveis que sejam seus; inicie um servidor de desenvolvimento apenas quando a próxima verificação precisar de um. Escolha as verificações pelo impacto usando [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), em vez de repetir uma execução completa inalterada.

Mantenha o trabalho delegado relacionado com escopo definido e sem sobreposição. Um único agente é responsável pelas verificações pesadas e pelas sessões de navegador. Atualize o estado durável quando uma parte concluída, um bloqueio ou uma passagem de bastão mudar o que o próximo colaborador precisa saber; não registre mecanicamente cada comando.
