# Lucru de lungă durată cu agenți

Folosiți o stare durabilă a sarcinii atunci când lucrul trebuie reluat sau predat ori când o singură rulare este suficient de lungă încât, prin compactarea contextului, să se piardă evidența lucrului rămas. Sarcinile mici nu au nevoie de un panou de sarcini sau de un fișier de progres. Pentru lucrul partajat, păstrați un `feature-list.json` și un `progress.md` concise într-un director `docs/agent-runs/<slug>/` dedicat sarcinii, folosind șabloanele existente acolo unde sunt utile.

Consemnați rezultatul cerut, ramura/worktree-ul curent, proprietatea asupra fișierelor, modificările încheiate, verificările împreună cu rezultatele lor, procesele/sesiunile deținute și următorul pas nerezolvat. Nu stocați credențiale sau extrase arbitrare de cod sursă. Marcați o funcționalitate ca încheiată doar atunci când criteriile ei de acceptare au fost verificate.

La reluare, inspectați starea Git, cel mai recent progres și sursa relevantă înainte de a edita. Refolosiți resursele proprii compatibile; porniți un server de dezvoltare doar când următoarea verificare are nevoie de el. Alegeți verificările în funcție de impact, folosind [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), în loc să repetați o trecere completă neschimbată.

Păstrați lucrul delegat aferent bine delimitat și fără suprapuneri. Un singur agent se ocupă de verificările grele și de sesiunile de browser. Actualizați starea durabilă atunci când o porțiune încheiată, un blocaj sau o predare schimbă ce trebuie să știe următorul contribuitor; nu consemnați mecanic fiecare comandă.
