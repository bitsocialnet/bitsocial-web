# Pangmatagalang gawain ng ahente

Gumamit ng matibay na estado ng gawain kapag kailangang ipagpatuloy o iabot ang trabaho, o kapag sapat na katagal ang iisang run para mawala sa context compaction ang pagsubaybay sa natitirang trabaho. Hindi kailangan ng board o progress file ang maliliit na gawain. Para sa nakabahaging trabaho, panatilihin ang maikling `feature-list.json` at `progress.md` sa isang `docs/agent-runs/<slug>/` na tiyak sa gawain, gamit ang mga umiiral na template kung makatutulong.

Itala ang hiniling na resulta, ang kasalukuyang branch/worktree, ang pagmamay-ari ng mga file, ang mga natapos na pagbabago, ang mga pagsusuri kasama ang mga resulta nito, ang mga proseso/session na pagmamay-ari, at ang susunod na hakbang na hindi pa nalulutas. Huwag mag-imbak ng mga credential o basta-bastang dump ng source. Markahan lamang na kumpleto ang isang feature kapag na-verify na ang mga pamantayan sa pagtanggap nito.

Sa pagpapatuloy, suriin ang estado ng Git, ang pinakabagong progreso, at ang kaugnay na source bago mag-edit. Muling gamitin ang mga katugmang resource na pagmamay-ari; magsimula lamang ng dev server kapag kailangan ito ng susunod na pagsusuri. Pumili ng mga pagsusuri ayon sa epekto gamit ang [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), sa halip na ulitin ang isang buong pass na walang nagbago.

Panatilihing may saklaw at hindi nagsasapawan ang magkakaugnay na ipinasang trabaho. Iisang ahente ang may-ari ng mabibigat na pagsusuri at ng mga browser session. I-update ang matibay na estado kapag binabago ng isang natapos na bahagi, blocker, o handoff ang kailangang malaman ng susunod na contributor; huwag mekanikal na itala ang bawat command.
