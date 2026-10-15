---
title: Bitsocial e Urbit
description: Como o Urbit, uma rede de servidores pessoais com Urbit IDs baseados no Ethereum e grupos mantidos pelo próprio host no Tlon Messenger, se compara às comunidades peer-to-peer do Bitsocial.
---

# Bitsocial e Urbit

O [Urbit](https://urbit.org/) é uma rede de servidores pessoais. Cada usuário tem um computador
sempre ligado chamado nave (ship), que roda o sistema operacional próprio do Urbit (Arvo), escrito
nas linguagens próprias do Urbit (Nock e Hoon), e é identificado por um Urbit ID. Seu principal app
social é o [Tlon Messenger](https://tlon.io/), criado pela Tlon, a empresa fundada em 2013 para
desenvolver o Urbit.

O Urbit quer substituir toda a pilha de computação, então é um projeto muito mais amplo que o
Bitsocial. Sua camada social, porém, usa um modelo próximo ao do Bitsocial: uma comunidade fica no
nó de seu dono, e esse nó decide o que entra. Os dois diferem em quem precisa rodar um servidor e em
como o spam é mantido do lado de fora.

## Como o Urbit funciona

- **Urbit IDs.** Toda nave tem um Urbit ID: um número exibido como um nome pronunciável, como
  `~sampel-palnet`. Os IDs de Layer 1 são NFTs cuja propriedade e cujas chaves públicas de rede
  ficam registradas nos contratos Azimuth no Ethereum. Os IDs de Layer 2, adicionados em 2021 para
  reduzir as taxas, usam um "naive rollup": suas transações são publicadas no Ethereum em lotes, mas
  a propriedade deles não é armazenada no contrato Azimuth, e cada nave a calcula localmente. A Tlon
  mantém um roller gratuito para uso público, segundo a
  [documentação do Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) e a página
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Uma hierarquia fixa.** O espaço de endereços tem 256 galáxias, 65.536 estrelas e cerca de 4
  bilhões de planetas para uso cotidiano. As galáxias emitem estrelas, as estrelas emitem planetas,
  e cada planeta pode emitir luas para os próprios dispositivos. Os cometas são IDs gratuitos que
  uma nave gera para si mesma e que nunca tocam a blockchain. Os donos das galáxias formam o
  Galactic Senate, que vota as atualizações dos contratos Azimuth e elege o conselho da Urbit
  Foundation.
- **Rede.** As naves trocam pacotes criptografados de forma peer-to-peer. Desde julho de 2026, o
  protocolo de rede é o [Directed Messaging](https://urbit.org/blog/directed-messaging), uma
  reescrita centrada em conteúdo do antigo protocolo Ames. As galáxias cuidam da descoberta de
  peers: cada uma acompanha onde estão as naves abaixo dela e retransmite pacotes para elas até que
  as duas naves consigam se alcançar diretamente, ou enquanto um firewall impedir isso, segundo o
  [artigo sobre o Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Grupos.** No Tlon Messenger, um grupo é hospedado pela nave de quem o criou. Os membros enviam
  mensagens ao host, que as distribui para a nave de cada membro, e a nave de cada membro guarda sua
  própria cópia, segundo o [FAQ da Tlon](https://tlon.io/posts/faq). O host controla papéis, canais
  e a admissão de membros. Um grupo pode ser público, privado ou secreto, e pode
  [banir naves individuais ou categorias inteiras de ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Os canais são chats, cadernos ou coleções de imagens e links.
- **Hospedagem.** Ao se cadastrar na Tlon, um novo usuário recebe uma nave que a Tlon roda, com
  chaves que ficam sob a custódia da Tlon. O usuário pode exportar a nave e seu master ticket e
  rodá-la em outro lugar: em um dispositivo da [Native Planet](https://www.nativeplanet.io/) ou com
  o runtime Vere no Linux, macOS ou Windows. As naves ainda não conseguem armazenar arquivos grandes
  diretamente, então o Tlon Messenger coloca imagens e outras mídias em armazenamento em nuvem
  compatível com S3.

## Onde eles diferem

### Quem precisa rodar um servidor

No Urbit, todo participante é um servidor. Os apps da Tlon são front-ends para a própria nave do
usuário, e até ler um grupo passa por ela. Quem não roda uma nave por conta própria aluga uma, o que
traz de volta um provedor de hospedagem: a Tlon guarda as chaves dos usuários hospedados e mantém
acesso limitado para manutenção, embora os usuários possam sair levando a nave inteira.

No Bitsocial, só os donos de comunidades precisam de um nó sempre ligado. Quem lê e publica pode
rodar um nó peer-to-peer dentro de uma aba do navegador, e sua conta é um par de chaves que o app
guarda. Veja [Peer-to-peer no navegador](/browser-p2p/). Quando alguém de fato usa um nó hospedado,
o design do Bitsocial busca permitir que a pessoa delegue a disponibilidade sem entregar a custódia
da identidade. Veja [Identidade e propriedade comunitária](/identity-and-ownership/).

### O host da comunidade

É aqui que os dois mais se aproximam. Um grupo do Tlon e uma comunidade Bitsocial ficam, ambos, no
nó de seu dono. O host decide quem pode publicar, aplica a moderação e distribui o resultado, e
nenhum dos dois protocolos coloca um moderador acima do host. Em ambos, o host precisa estar online.
O FAQ da Tlon diz que, se o host fica offline, "o grupo cai junto com ele", e uma comunidade
Bitsocial não consegue aceitar novos posts enquanto seu nó está offline.

Eles armazenam o conteúdo de formas diferentes. A nave de cada membro guarda uma cópia do histórico
do grupo, então os membros ainda conseguem ler o que já receberam enquanto o host está fora do ar.
Um leitor do Bitsocial busca o estado mais recente da comunidade no nó da comunidade ou nos peers
que fazem seed dela, então uma comunidade offline continua legível enquanto houver peers com ela,
mas a rede guarda apenas o estado mais recente.

Um grupo do Tlon também tem uma lista de membros, e seu host pode torná-lo exclusivo para
convidados. Uma comunidade Bitsocial não tem o conceito de membro: qualquer pessoa pode lê-la, e
qualquer pessoa pode tentar publicar, desde que passe pelo desafio da comunidade.

### Spam e identidade

O Urbit combate o spam tornando a identidade escassa. A oferta de planetas é fixa, e cada um é
emitido por uma estrela. Os cometas gratuitos contornam essa escassez, então os grupos que querem
mantê-la os barram: a documentação do Urbit observa que alguns grupos recusam cometas, e um grupo do
Tlon pode banir toda a categoria dos cometas com uma única configuração. Com os cometas barrados, um
usuário banido precisa de outro planeta, obtido do dono de uma estrela, para voltar. A reputação
também pode seguir a hierarquia: o Azimuth inclui um contrato Censures que permite a galáxias e
estrelas sinalizar IDs. Como a escassez está embutida no espaço de endereços, ela funciona da mesma
forma em todo grupo que barra cometas.

As identidades do Bitsocial são pares de chaves gratuitos. Cada comunidade escolhe o próprio desafio
antes de aceitar um post, como um captcha, um pagamento, um saldo de tokens ou uma lista de
permissão, e outras comunidades podem escolher de outro jeito. Veja
[Desafios antispam personalizados](/custom-challenges/).

### Blockchain e governança

A camada de identidade do Urbit depende do Ethereum. Os contratos Azimuth registram a propriedade e
as chaves de rede da Layer 1, as transações da Layer 2 são publicadas no Ethereum em lotes, e o
Galactic Senate pode atualizar o contrato que governa o Azimuth. As mesmas 256 galáxias também
cuidam da descoberta de peers e da retransmissão, então um conjunto fixo de identidades carrega
tanto a governança quanto parte do roteamento da rede.

As identidades do Bitsocial são pares de chaves que não exigem registro. Os nomes `.bso` e `.eth`
são apelidos opcionais que resolvem para elas. A descoberta de peers passa por roteadores HTTP que
só retornam endereços de provedores; qualquer pessoa pode rodar um, e os clientes podem trocar de
roteador mudando sua configuração.

### Escopo

O Urbit é um computador de uso geral. Uma nave pode hospedar um remoto Git, uma base de conhecimento
pessoal ou agentes de IA, e o Tlon Messenger é um programa entre muitos. Desenvolver para o Urbit
significa, na maior parte das vezes, escrever apps em Hoon para o Arvo. O Bitsocial é um protocolo
para comunidades públicas, com apps como [5chan](/apps/5chan/) e [Seedit](/apps/seedit/). Ele roda
sobre a pilha existente (libp2p, IPFS e o navegador) em vez de substituí-la, e seus clientes são
construídos com ferramentas web comuns. Veja [Crie seu próprio cliente](/build-your-own-client/).

### Mensagens privadas

É aqui que o Urbit leva vantagem. As mensagens diretas vão de uma nave diretamente para outra, todo
o tráfego entre naves é criptografado, e os grupos podem ser privados ou secretos. A Tlon observa
que as mensagens são criptografadas em trânsito, mas armazenadas sem criptografia na nave. O
Bitsocial se concentra em comunidades públicas e ainda não tem mensagens diretas nativas.

## Situação do projeto

O Urbit passou por turbulências. Em agosto de 2024, a Urbit Foundation, a organização sem fins
lucrativos que orienta o desenvolvimento central, demitiu seu diretor executivo; o fundador Curtis
Yarvin voltou para liderar a estratégia sem cargo formal, vários desenvolvedores centrais saíram, e
o caixa da Foundation só dava para alguns meses,
[informou a CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin propôs mover o Azimuth para uma layer 2 já existente do Ethereum, provavelmente a Base, e
emitir tokens fungíveis de "visto" que se convertem em planetas. Em outubro de 2026, a
[documentação de ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) do Urbit ainda descreve o
Azimuth no Ethereum com seu naive rollup. Em outubro de 2025, o Galactic Senate substituiu o
conselho da Foundation, e o novo conselho nomeou um novo diretor executivo
([anúncio](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

O desenvolvimento continua. O Directed Messaging entrou no ar com a versão 408k em 14 de julho
de 2026. Em junho de 2026, o Tlon Messenger
[abriu cadastros públicos sem lista de espera](https://urbit.org/blog/this-month-in-urbit-june-2026),
e a Tlon agora se apresenta como um lugar onde pessoas e agentes de IA trabalham juntos.

## Comparação

| Pergunta                | Urbit                                                                                                  | Bitsocial                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Categoria               | Rede de servidores pessoais e sistema operacional                                                      | Rede de comunidades peer-to-peer                                                                                |
| Identidade              | Urbit IDs: cerca de 4 bilhões de planetas no Ethereum ou no rollup de Layer 2, mais cometas gratuitos  | Pares de chaves Ed25519 para usuários e comunidades                                                             |
| Quem roda um servidor   | Todo usuário, na própria nave ou em uma hospedada                                                      | Donos de comunidades; quem lê e publica pode usar uma aba do navegador                                          |
| Onde ficam os posts     | A nave do host do grupo e uma cópia na nave de cada membro                                             | O nó do dono da comunidade e os peers que a leem e fazem seed dela                                              |
| Comunidades             | Grupos hospedados pela nave de quem os criou, com listas de membros                                    | Objetos de primeira classe cujo nó aceita ou rejeita posts                                                      |
| Controle de spam        | IDs escassos emitidos por estrelas; grupos banem naves ou categorias inteiras                          | O desafio de cada comunidade antes de um post ser aceito                                                        |
| Moderação               | Os papéis e banimentos definidos pelo host do grupo                                                    | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram                               |
| Descoberta de peers     | As galáxias acompanham as naves abaixo delas e retransmitem pacotes para elas                          | Roteadores HTTP retornam peers provedores e não armazenam conteúdo                                              |
| Governança              | O Galactic Senate de 256 galáxias vota as atualizações do Azimuth                                      | Nenhuma autoridade no nível do protocolo sobre identidades ou comunidades                                       |
| Mensagens privadas      | Mensagens diretas criptografadas e grupos só para convidados                                           | Comunidades públicas; ainda sem mensagens diretas nativas                                                       |
| Contrapartida principal | Um computador pessoal completo com grupos privados, mas todo usuário precisa de uma nave sempre ligada | Identidades gratuitas e acesso pelo navegador, mas sem mensagens privadas e só o estado mais recente é guardado |
