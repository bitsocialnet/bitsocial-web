# Puna afatgjatë e agjentëve

Përdorni gjendje të qëndrueshme të detyrës kur puna duhet rifilluar ose dorëzuar te dikush tjetër, ose kur një ekzekutim i vetëm zgjat aq sa ngjeshja e kontekstit mund ta humbasë gjurmën e punës që mbetet. Detyrat e vogla nuk kanë nevojë për tabelë apo skedar progresi. Për punë të përbashkët, mbani një `feature-list.json` dhe një `progress.md` koncize në një `docs/agent-runs/<slug>/` specifike për detyrën, duke përdorur shabllonet ekzistuese kur ndihmojnë.

Regjistroni rezultatin e kërkuar, degën/worktree-n aktual, pronësinë e skedarëve, ndryshimet e përfunduara, kontrollet bashkë me rezultatet, proceset/sesionet në pronësi dhe hapin e radhës që ende nuk është zgjidhur. Mos ruani kredenciale ose kopje arbitrare të kodit burimor. Shënojeni një veçori si të përfunduar vetëm kur kriteret e saj të pranimit janë verifikuar.

Kur rifilloni, inspektoni gjendjen e Git-it, progresin më të fundit dhe kodin burimor përkatës përpara se të redaktoni. Ripërdorni burimet e përputhshme që zotëroni; nisni një server zhvillimi vetëm kur kontrolli i radhës ka nevojë për të. Zgjidhni kontrollet sipas ndikimit duke përdorur [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), në vend që të përsërisni një kalim të plotë kur asgjë nuk ka ndryshuar.

Mbajeni punën e deleguar të lidhur të kufizuar dhe pa mbivendosje. Kontrollet e rënda dhe sesionet e shfletuesit i zotëron një agjent i vetëm. Përditësoni gjendjen e qëndrueshme kur një pjesë e përfunduar, një bllokues ose një dorëzim ndryshon atë që duhet të dijë kontribuesi i radhës; mos regjistroni mekanikisht çdo komandë.
