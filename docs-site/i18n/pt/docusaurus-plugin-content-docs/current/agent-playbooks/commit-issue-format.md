# Formato de confirmação e emissão

Use isto ao propor ou implementar alterações significativas no código.

## Formato de sugestão de commit

- **Título:** Estilo de commits convencionais, curto, envolto em crases.
- Use `perf` (não `fix`) para otimizações de desempenho.
- **Descrição:** 2 a 3 frases informais opcionais descrevendo a solução. Conciso, técnico, sem marcadores.

Exemplo:

> **Título do commit:** `fix: correct date formatting in timezone conversion`
>
> `formatDate()` atualizado em `date-utils.ts` para lidar adequadamente com as compensações de fuso horário.

## Formato de sugestão de problema do GitHub

- **Título:** O mais curto possível, envolto em crases.
- **Descrição:** 2 a 3 frases informais descrevendo o problema (não a solução), como se ainda não tivesse sido resolvido.

Exemplo:

> **Problema do GitHub:**
>
> - **Título:** `Date formatting displays incorrect timezone`
> - **Descrição:** Os carimbos de data e hora dos comentários mostram fusos horários incorretos quando os usuários visualizam postagens de regiões diferentes. A função `formatDate()` não leva em conta as configurações de fuso horário local do usuário.
