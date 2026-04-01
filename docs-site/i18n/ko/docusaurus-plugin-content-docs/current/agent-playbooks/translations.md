# 번역 작업 흐름

이 프로젝트는 `public/translations/{lang}/default.json`의 i18next 번역 파일을 사용합니다.

## 규칙

모든 언어 파일을 수동으로 편집하지 마십시오. `scripts/update-translations.js`를 사용하세요.

## 키 추가 또는 업데이트

1. 임시 사전 파일을 생성하세요. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. 번역 맵 적용:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. 임시 사전 파일을 삭제합니다.

## 기타 유용한 명령

```bash
# Copy a key from English to all languages (dry run then write)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Delete a key from all languages
node scripts/update-translations.js --key obsolete_key --delete --write

# Audit for unused translation keys
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
