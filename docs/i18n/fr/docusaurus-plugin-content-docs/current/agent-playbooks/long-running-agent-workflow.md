# Travail d'agent de longue durée

Utilisez un état de tâche durable lorsque le travail doit pouvoir être repris ou transmis, ou lorsqu'une seule exécution dure assez longtemps pour que la compaction du contexte risque de faire perdre le fil du travail restant. Les petites tâches n'ont besoin ni de tableau de suivi ni de fichier de progression. Pour un travail partagé, tenez un `feature-list.json` et un `progress.md` concis dans un `docs/agent-runs/<slug>/` propre à la tâche, en vous servant des modèles existants quand c'est utile.

Consignez le résultat demandé, la branche/le worktree courant, la propriété des fichiers, les changements terminés, les vérifications avec leurs résultats, les processus/sessions possédés et la prochaine étape non résolue. Ne stockez ni identifiants ni copies arbitraires du code source. Ne marquez une fonctionnalité comme terminée que lorsque ses critères d'acceptation sont vérifiés.

À la reprise, inspectez l'état Git, la dernière entrée de progression et le code source pertinent avant toute modification. Réutilisez les ressources compatibles que vous possédez ; ne démarrez un serveur de développement que si la prochaine vérification en a besoin. Choisissez les vérifications selon l'impact à l'aide de [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), plutôt que de relancer telle quelle une passe complète.

Délimitez clairement le travail délégué connexe et évitez les chevauchements. Un seul agent prend en charge les vérifications lourdes et les sessions de navigateur. Mettez à jour l'état durable lorsqu'une tranche terminée, un blocage ou un transfert change ce que le prochain contributeur doit savoir ; ne journalisez pas mécaniquement chaque commande.
