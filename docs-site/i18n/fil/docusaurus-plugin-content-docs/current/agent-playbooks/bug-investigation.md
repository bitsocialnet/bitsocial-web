# Workflow ng Pagsisiyasat ng Bug

Gamitin ito kapag may iniulat na bug sa isang partikular na file/line/code block.

## Mandatory Unang Hakbang

Bago mag-edit, suriin ang kasaysayan ng git para sa nauugnay na code. Maaaring nagpakilala ang mga naunang nag-ambag ng gawi para sa isang edge case/workaround.

## Daloy ng trabaho

1. I-scan ang mga kamakailang commit na pamagat (mga pamagat lamang) para sa file/lugar:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Siyasatin lamang ang mga nauugnay na commit na may mga saklaw na pagkakaiba:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Magpatuloy sa pagpaparami at ayusin pagkatapos maunawaan ang konteksto ng kasaysayan.

## Panuntunan sa Pag-troubleshoot

Kapag na-block, maghanap sa web para sa mga kamakailang pag-aayos/mga solusyon.
