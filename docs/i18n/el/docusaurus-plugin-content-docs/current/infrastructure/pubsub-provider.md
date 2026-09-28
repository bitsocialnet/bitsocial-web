---
title: Pubsub Provider
description: Εφεδρικός αναμεταδότης pubsub και πάροχος ανατεθειμένης δρομολόγησης για χειριστές Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Το Pubsub Provider είναι μια υπηρεσία για χειριστές, που εκτελεί έναν εφεδρικό αναμεταδότη pubsub συμβατό με το Bitsocial μαζί με έναν ενσωματωμένο κόμβο Kubo. Οι σύγχρονοι πελάτες Bitsocial, όπως το 5chan και το Seedit, χρησιμοποιούν από προεπιλογή καθαρή peer-to-peer δικτύωση στο πρόγραμμα περιήγησης, αλλά αυτή η υπηρεσία παραμένει χρήσιμη ως προαιρετική εφεδρική διαδρομή για χρήστες που απενεργοποιούν το P2P στο πρόγραμμα περιήγησης ή για χειριστές που θέλουν δημόσια τερματικά σημεία συμβατότητας.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Εικόνα Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Άδεια χρήσης**: GPL-3.0-or-later

## Τι εκτελεί

- έναν δημόσιο διαμεσολαβητή HTTP για τις διαδρομές pubsub, πύλης, παρόχου ονομάτων και ανατεθειμένης δρομολόγησης
- έναν ενσωματωμένο κόμβο Kubo με ενεργοποιημένο το pubsub
- έναν πάροχο ανατεθειμένης δρομολόγησης HTTP στο `/routing/v1/providers`
- μετρήσεις Prometheus στο `/metrics`
- προαιρετική πρόσβαση με basic auth στο πλήρες API RPC του Kubo

## Θύρες

Οι προεπιλογές έχουν επιλεγεί ώστε το Pubsub Provider να μπορεί να εκτελείται δίπλα στο [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) στο ίδιο VPS, χωρίς σύγκρουση στη θύρα swarm.

| Σκοπός                       | Προεπιλογή                        | Σημειώσεις                                                           |
| ---------------------------- | --------------------------------- | -------------------------------------------------------------------- |
| Δημόσιος διαμεσολαβητής HTTP | `8000` εφαρμογή, `80` host Docker | Ορίστε το `PUBSUB_PROVIDER_HTTP_PORT` για αλλαγή της θύρας του host. |
| Swarm του Kubo               | `4002` TCP/UDP                    | Αποφεύγει την προεπιλεγμένη θύρα swarm `4001` του seeder.            |
| API του Kubo                 | `5001` μόνο τοπικά                | Χρησιμοποιείται εσωτερικά από τον διαμεσολαβητή.                     |
| Πύλη του Kubo                | `8080` μόνο τοπικά                | Χρησιμοποιείται εσωτερικά από τον διαμεσολαβητή.                     |

## Εγκατάσταση με Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Ελέγξτε τα αρχεία καταγραφής:

```bash
docker logs --follow pubsub-provider
```

Δοκιμάστε τον διαμεσολαβητή:

```bash
curl http://127.0.0.1/commit-hash
```

## Αναβάθμιση

Αν προηγουμένως εκτελούσατε την παλιά εικόνα `latest`, αναγκάστε το Compose να ξαναδημιουργήσει το container από τη δημοσιευμένη εικόνα με καρφωμένη έκδοση:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Επαληθεύστε ότι εκτελείται η διορθωμένη εικόνα:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Τα αρχεία καταγραφής θα πρέπει να περιέχουν `using Kubo binary at /app/bin/ipfs` και να μην περιέχουν `downloading ipfs`.

## Εκτέλεση μαζί με το Bitsocial Seeder

Αν ο ίδιος υπολογιστής εκτελεί επίσης το `bitsocial-seeder`, κρατήστε το Pubsub Provider στη θύρα swarm `4002` ή σε κάποια άλλη θύρα εκτός της `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Έτσι αποφεύγεται η σύγκρουση θυρών που προκύπτει όταν δύο κόμβοι Kubo προσπαθούν να δεσμεύσουν και οι δύο τη θύρα TCP/UDP `4001`.

## Διαμόρφωση

Συνηθισμένες παρακάμψεις μέσω μεταβλητών περιβάλλοντος:

```env
PUBSUB_PROVIDER_HTTP_PORT=80
PUBSUB_PROVIDER_SWARM_PORT=4002
PUBSUB_PROVIDER_PORTS=8000
KUBO_RPC_URL=http://127.0.0.1:5001/api/v0
IPFS_GATEWAY_URL=http://127.0.0.1:8080
HTTP_ROUTER_URLS=https://example-router.invalid
PUBSUB_PROVIDER_ROUTING_STORE_PATH=
BASIC_AUTH_USERNAME=
BASIC_AUTH_PASSWORD=
IPFS_GATEWAY_USE_SUBDOMAINS=false
SHUTDOWN_KEY=
ETH_PROVIDER_URL=
ETH_PROVIDER_URL_WS=
SOL_PROVIDER_URL=
```

Χρησιμοποιήστε τον πάροχο ως εφεδρικό αναμεταδότη, όχι ως αντικατάσταση του P2P στο πρόγραμμα περιήγησης. Συνεχίστε να εκτελείτε ξεχωριστά την υποδομή tracker όταν το δίκτυο χρειάζεται αποκλειστική χωρητικότητα για την ανακάλυψη ομότιμων κόμβων.
