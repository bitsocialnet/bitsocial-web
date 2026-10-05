# Vérification

Choisissez les vérifications en fonction du comportement modifié et de l'incertitude qui subsiste. Réutilisez une preuve concluante déjà obtenue pour le même état final ; relancez après des modifications pertinentes ou des échecs. Les exigences explicites de la CI, de la release ou de l'utilisateur s'appliquent toujours.

| Changement                                                              | Vérifications appropriées                                                                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Prose/commentaires/formatage uniquement                                 | Diff, références, générateurs concernés ; pas de build de l'application                                                              |
| Sources/configuration du workflow IA                                    | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test` ; régénérer les index LLM quand le contexte a changé      |
| Utilitaire ou script isolé                                              | Invocation/fixtures ciblées et vérifications de syntaxe ou de types/lint pour le code concerné                                       |
| Changement de runtime partagé, de dépendance, de build ou d'intégration | Vérifications ciblées sur ce qui est touché, plus les vérifications de build/types/lint pertinentes ci-dessous                       |
| CSS/thème/mise en page uniquement                                       | Routes/viewports/thèmes concernés dans les navigateurs choisis ; build quand les imports, les assets ou le traitement CSS ont changé |
| État/effets/performances React                                          | Comportement concerné et recommandations React applicables ; Doctor lorsque ses diagnostics répondent à une préoccupation concrète   |

## Vérifications du projet

- `yarn build:verify` sélectionne l'espace de travail concerné. Pour un périmètre connu, utilisez `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` ou `yarn docs:build:verify`.
- `yarn build` exécute volontairement le build de production complet du site about et de la documentation, toutes les locales de la documentation comprises. Utilisez-le pour une validation à l'échelle d'une release ou pour des changements qui justifient ce périmètre.
- `yarn lint`, `yarn typecheck` et `yarn format:check` couvrent les barrières existantes du dépôt ; pour une modification ciblée d'un script, commencez par ses propres vérifications de syntaxe/fixtures/format.
- Les changements de manifeste/lockfile exigent `corepack yarn install`, `yarn deps:check-pinned` et `yarn deps:check-hardened`. `yarn knip` est consultatif pour les dépendances/imports.
- Les vérifications des traductions de la documentation se trouvent dans [translations.md](translations.md) ; ne lancez pas l'outil d'écriture de traductions en masse pour un changement ciblé de la documentation.

## Preuves en navigateur et propriété

Utilisez Chrome pour les petits changements isolés côté navigateur. Ajoutez Firefox et WebKit pour les changements partagés de CSS/mise en page/responsive, les API sensibles au navigateur, les interactions étendues, les releases ou des critères multinavigateurs explicites. Incluez les mises en page mobiles et le comportement tactile concernés. Un simple redimensionnement du viewport n'est pas une émulation tactile. Choisissez de vraies routes et de vrais contenus à partir du code source, au lieu de supposer que les exemples sont disponibles.

Utilisez `playwright-cli` via `./scripts/pw-session.sh`. Un seul navigateur est actif sur toute la machine ; les moteurs choisis s'exécutent les uns après les autres, et chaque session possédée, désignée par son nom exact, est fermée même après un échec. Réutilisez une session autorisée appartenant à l'appelant sans la fermer. N'utilisez jamais de nettoyage global des navigateurs et n'arrêtez jamais un serveur dont la propriété n'est pas claire. Aucun navigateur ni serveur n'est nécessaire pour un travail portant uniquement sur la documentation.

Pour un travail sur les performances, comparez le même parcours avec un viewport, un contenu, des réglages réseau/CPU, un mode de build et un surcoût de mesure équivalents. Distinguez les observations des causes supposées. Utilisez le skill de profilage quand ces mesures répondent à la demande réelle.

## Preuves finales

Un seul agent prend en charge la vérification lourde. Inspectez les charges de travail actives et sérialisez les installations, les builds/suites complètes, Doctor, le travail Android/Electron et le profilage navigateur. Indiquez les commandes et leurs résultats ainsi que les limites précises ; des données manquantes ou un moteur ignoré ne constituent pas un résultat réussi. Les fixtures d'outillage vérifient les formats et les mécanismes, pas la découverte de bout en bout dans l'application ni la qualité des décisions du modèle.

## Vérifications React automatiques

`yarn agent:verify` exécute les builds sélectionnés, puis `yarn doctor:check` et `yarn perf:check`. `perf:check` inclut l'auto-test de compatibilité du collecteur et de régression délibérée, si bien que ni la CI ni le chemin de vérification de l'agent n'ont besoin d'une passe `perf:test` distincte. Installez une seule fois l'outillage navigateur épinglé avec `yarn perf:install` (`--with-deps` en CI Linux). Utilisez des filtres de cible/scénario pour les relances ciblées après la passe complète pertinente. Les budgets des scénarios sont explicites dans `scripts/react-perf/config.mjs` ; conservez les preuves et corrigez une régression avant d'envisager un changement de ligne de base justifié. Les builds de production ordinaires omettent Bippy ; des commandes `build:profile:*` distinctes fournissent l'instrumentation officielle de profilage React.

Le scénario `apps-search` du site about attend, après chaque caractère, que la valeur de l'URL et du champ de saisie soit appliquée avant de taper le suivant. Son résultat positif couvre cette séquence de requêtes appliquées, pas la réactivité lors d'une frappe rapide. Utilisez une reproduction distincte avec saisie rapide pour évaluer la perte de caractères ou la réactivité de la saisie.
