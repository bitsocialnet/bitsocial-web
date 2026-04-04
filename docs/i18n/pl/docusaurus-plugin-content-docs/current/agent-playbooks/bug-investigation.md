# Przebieg badania błędów

Użyj tej opcji, gdy zostanie zgłoszony błąd w konkretnym pliku/wierszy/bloku kodu.

## Obowiązkowy pierwszy krok

Przed edycją sprawdź historię git pod kątem odpowiedniego kodu. Poprzedni współpracownicy mogli wprowadzić zachowanie w przypadku przypadku/obejścia na krawędzi.

## Przepływ pracy

1. Skanuj tytuły ostatnich zatwierdzeń (tylko tytuły) dla pliku/obszaru:

```bash
# Tytuły ostatnich zatwierdzeń dla określonego pliku
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Tytuły ostatnich zatwierdzeń dla określonego zakresu linii
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Sprawdź tylko istotne zatwierdzenia z różnicami o określonym zakresie:

```bash
# Pokaż komunikat zatwierdzenia + różnicę dla jednego pliku
git show <commit-hash> -- path/to/file.tsx
```

3. Kontynuuj reprodukcję i napraw po zrozumieniu kontekstu historycznego.

## Zasada rozwiązywania problemów

Po zablokowaniu przeszukaj Internet w poszukiwaniu najnowszych poprawek/obejść.
