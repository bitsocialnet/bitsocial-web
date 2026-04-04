# Agent Hooks -asetukset

Jos AI-koodausavustajasi tukee elinkaaren koukkuja, määritä ne tätä repoa varten.

## Suositellut koukut

| Koukku          | Komento                                    | Tarkoitus                                                                                                                                                                                     |
| --------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Muotoile tiedostot automaattisesti tekoälyn muokkauksen jälkeen                                                                                                                               |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Suorita `corepack yarn install`, kun `package.json` muuttuu                                                                                                                                   |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Leikkaa vanhentuneet viitteet ja poista integroidut väliaikaiset tehtävähaarat                                                                                                                |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Kovan portin koonti-, nukka-, tyyppi- ja muototarkistukset; pitää `yarn npm audit` tiedot ja suorittaa `yarn knip` erikseen neuvoa-antavana tarkastuksena, kun riippuvuudet/tuonnit muuttuvat |

## Miksi?

- Johdonmukainen muotoilu
- Lukitustiedosto pysyy synkronoituna
- Rakenne-/nukka-/tyyppiongelmat havaittiin aikaisin
- Suojauksen näkyvyys `yarn npm audit`:n kautta
- Riippuvuus/tuontipoikkeama voidaan tarkistaa `yarn knip`:lla muuttamatta sitä äänekkääksi globaaliksi pysäytyskoukuksi
- Yksi jaettu koukkutoteutus sekä Codexille että Cursorille
- Väliaikaiset tehtävähaarat pysyvät linjassa repon työpuun työnkulun kanssa

## Esimerkki Hook-skriptit

### Muotoile koukku

```bash
#!/bin/bash
# Muotoile JS/TS-tiedostot automaattisesti tekoälyn muokkauksen jälkeen
# Hook vastaanottaa JSON-tiedoston stdinin kautta tiedostopolkulla

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Vahvista koukku

```bash
#!/bin/bash
# Suorita koonti-, nukka-, tyyppitarkistus, muototarkistus ja suojaustarkastus, kun agentti on valmis

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Oletuksena `scripts/agent-hooks/verify.sh` poistuu nollasta poikkeavalla tavalla, kun vaadittu tarkistus epäonnistuu. Aseta `AGENT_VERIFY_MODE=advisory` vain silloin, kun tarvitset tarkoituksella signaalia katkenneesta puusta tukkimatta koukkua. Pidä `yarn knip` poissa kovasta portista, ellei repo nimenomaisesti päätä epäonnistua neuvoa-antavien tuonti-/riippuvuusongelmien vuoksi.

### Lanka asennuskoukku

```bash
#!/bin/bash
# Suorita corepack yarn install, kun package.json muutetaan
# Hook vastaanottaa JSON-tiedoston stdinin kautta tiedostopolkulla

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

if [ -z "$file_path" ]; then
  exit 0
fi

if [ "$file_path" = "package.json" ]; then
  cd "$(dirname "$0")/../.." || exit 0
  echo "package.json changed - running corepack yarn install to update yarn.lock..."
  corepack yarn install
fi

exit 0
```

Määritä koukkujohdot agenttityökalusi asiakirjojen mukaan (`hooks.json`, vastaava jne.).

Tässä repossa `.codex/hooks/*.sh`:n ja `.cursor/hooks/*.sh`:n tulisi pysyä ohuina kääreinä, jotka delegoivat `scripts/agent-hooks/`:n jaetuille toteutuksille.
