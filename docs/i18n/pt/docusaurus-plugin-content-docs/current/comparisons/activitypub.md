---
title: Bitsocial e ActivityPub
description: Como o Fediverse, com o Mastodon para microblog e o Lemmy para comunidades no estilo Reddit, se compara às comunidades peer-to-peer do Bitsocial.
---

# Bitsocial e ActivityPub

O [ActivityPub](https://www.w3.org/TR/activitypub/) é o padrão do W3C por trás do Fediverse. Os
usuários escolhem um servidor, chamado de instância, que hospeda sua conta, e os servidores trocam
posts entre si. O [Mastodon](https://joinmastodon.org/) é o software de microblog mais conhecido
desse ecossistema; o [Lemmy](https://join-lemmy.org/) é um agregador de links e fórum no estilo
Reddit, formado por comunidades temáticas, o que o torna o equivalente mais próximo, no Fediverse, de
apps Bitsocial como o [Seedit](/apps/seedit/).

## Como o ActivityPub funciona

- **Caixas de entrada e de saída.** Toda conta tem uma caixa de entrada (inbox) e uma caixa de saída
  (outbox). Os servidores entregam atividades nas caixas de entrada de outros servidores, e cada
  servidor receptor guarda sua própria cópia do que seus usuários seguem.
- **Identidade pertencente ao servidor.** Os IDs de contas e de posts são endereços HTTPS no domínio
  do servidor de origem. Um handle do Mastodon é `@user@domain`, resolvido com WebFinger, e o
  servidor assina as mensagens de federação em nome do usuário.
- **Clientes.** Apps e navegadores falam apenas com o servidor do próprio usuário, pela API desse
  servidor.
- **Comunidades do Lemmy.** Uma comunidade é um ator de grupo hospedado em uma instância. Os usuários
  enviam posts para a comunidade, que os retransmite para seus seguidores; pelo padrão compartilhado
  de fóruns ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)),
  uma comunidade pode validar os posts antes, chegando até a aprovação manual por moderadores.
- **Moderação.** A moderação é local a cada servidor. Os administradores podem suspender contas,
  bloquear servidores inteiros ou federar apenas com uma lista de permissão; o Lemmy também tem
  moderadores para cada comunidade.
- **Controle de spam.** O ActivityPub não define nenhum mecanismo antispam. O Mastodon e o Lemmy
  controlam os cadastros com aprovação, convites, perguntas de inscrição, captchas e verificação de
  e-mail, e depois contam com limites de taxa, denúncias e moderação.

## Onde eles diferem

### A identidade pertence a um domínio

Uma conta do Fediverse pertence ao domínio do seu servidor. O Mastodon pode redirecionar os
seguidores para uma nova conta, mas
[os posts não são transferidos](https://docs.joinmastodon.org/user/moving/), a mudança precisa
começar no servidor antigo e há um período de espera de 30 dias. No Bitsocial, perfis e comunidades
são pares de chaves, então trocar de host ou de app não muda a identidade. Veja
[Identidade e propriedade comunitária](/identity-and-ownership/).

### Onde uma comunidade vive

Uma comunidade do Lemmy é estruturalmente próxima de uma comunidade Bitsocial: os posts vão para a
comunidade, que pode verificá-los antes de retransmiti-los. A diferença é onde ela vive. Uma
comunidade do Lemmy só pode ser criada na instância de origem de quem a cria, o administrador da
instância tem [controle total](https://join-lemmy.org/docs/users/05-censorship-resistance.html) sobre
ela e não há uma forma documentada de movê-la para outra instância. Uma comunidade Bitsocial é seu
próprio par de chaves: o dono pode rodar o nó dela em qualquer lugar, e nenhum administrador de
servidor está acima dela.

### Controle de spam

Os servidores do Fediverse barram o spam principalmente no cadastro e moderam depois. Uma comunidade
Bitsocial executa um desafio em cada post antes de aceitá-lo, e cada comunidade escolhe o seu:
captcha, lista de permissão, pagamento ou qualquer outro código. Veja
[Desafios antispam personalizados](/custom-challenges/).

### Manter a infraestrutura

Manter uma instância significa ter um servidor sempre ligado, com domínio, TLS e e-mail. O Mastodon
também precisa de PostgreSQL, Redis e workers em segundo plano; o Lemmy é mais leve, com cerca de
150 MB de RAM, segundo os próprios números. Cada instância guarda cópias do conteúdo remoto que seus
usuários seguem. Um nó de comunidade Bitsocial não precisa de domínio nem de certificado e roda a
partir do app desktop ou do `bitsocial-cli`.

### O que os servidores oferecem em troca

Os servidores do Fediverse guardam o histórico completo e o servem de forma confiável, e o Mastodon
tem ferramentas de moderação maduras, construídas ao longo de anos. O Bitsocial não garante o
conteúdo antigo para sempre, e suas ferramentas de moderação ficam em cada app.

## Comparação

| Pergunta                | ActivityPub (Mastodon, Lemmy)                                                                | Bitsocial                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Categoria               | Servidores federados                                                                         | Rede de comunidades peer-to-peer                                                          |
| Identidade              | Conta no domínio de um servidor, assinada pelo servidor                                      | Pares de chaves Ed25519 para usuários e comunidades                                       |
| Onde ficam os posts     | O servidor de origem, mais cópias em cada servidor que segue                                 | O nó do dono da comunidade e os peers que a leem e fazem seed dela                        |
| Quem mantém no ar       | Administradores de instâncias                                                                | Nó do dono da comunidade mais seeders auxiliares                                          |
| Comunidades             | Comunidades do Lemmy hospedadas em uma instância                                             | Objetos de primeira classe cujo nó aceita ou rejeita posts                                |
| Controle de spam        | Barreiras no cadastro, limites de taxa, denúncias e moderação                                | O desafio de cada comunidade antes de um post ser aceito                                  |
| Moderação               | Administradores de servidores e moderadores de comunidades, local a cada servidor            | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram         |
| Nomes                   | Handles `@user@domain` e `!community@domain`                                                 | Nomes `.bso` e `.eth` que resolvem para chaves                                            |
| Navegador               | Cliente do servidor do próprio usuário                                                       | Nó peer-to-peer dentro de uma aba comum do navegador                                      |
| Contrapartida principal | Histórico confiável e moderação madura, mas identidade e comunidades pertencem a um servidor | Sem necessidade de servidor ou domínio, mas o conteúdo antigo não é garantido para sempre |
