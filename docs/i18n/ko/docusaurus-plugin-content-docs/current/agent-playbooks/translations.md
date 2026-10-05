# 번역

about 사이트는 `about/public/translations/{lang}/default.json`의 i18next JSON을 사용합니다. Docusaurus 소스 번역은 이와 별도로 `docs/i18n/`에 있습니다.

## about 사이트 키

`.agents/skills/translate/SKILL.md`를 사용하세요. 현재 로케일은 디스크에서 확인하고, 플레이스홀더, 마크업, 기술 용어, 브랜드 이름은 그대로 보존하세요. 규모가 큰 요청이라면 자식 에이전트가 각자 독립적인 맵을 생성할 수 있지만, 모든 로케일 쓰기는 부모 하나가 순차적으로 적용합니다. 업데이터에는 쓰기 잠금이 없습니다.

작업마다 고유한, 그 작업이 소유하는 맵 경로를 사용하세요. `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`로 미리 본 뒤, 같은 인수에 `--write`를 붙여 적용하세요. 쓴 뒤에는 적용 범위와 값을 확인하고, 이 작업이 소유한 임시 맵만 삭제하세요.

삭제를 요청받았다면 `--delete`를 사용하세요. 승인된 `--audit --write`를 실행하기 전에 `--audit --dry` 결과를 확인하세요. 동적 번역 키는 소스를 직접 검토해야 합니다. 영어를 모든 로케일에 그대로 복사하는 것은 기술 용어, 브랜드, 플레이스홀더인 경우에만 하세요.

## Docusaurus 페이지

`scripts/translate-docs.py`는 모든 페이지/로케일을 대상으로 하는 대량 작성기이며 파일별 필터가 없습니다. 범위가 좁은 번역 수정에는 사용하지 마세요. `scripts/check-docs-translations.py`는 읽기 전용 검증기이며 `--locales`와 `--paths`를 지원합니다.

코드 펜스, 링크, 인라인 코드, 컨트랙트 주소, 제목, 표, 애드모니션은 영어 원문과 일치하도록 유지하세요. 검증기 오류는 해결하세요. 브랜드 이름에 대한 `frontmatter-untranslated` 경고는 예상할 수 있습니다. 문서 테마나 i18n 동작을 바꿀 때는 `docs/AGENTS.md`를 따르고, 정적 출력과 Pagefind가 어긋나지 않도록 루트에서 빌드하세요.

## 선택적 의미 검토

선택한 i18next 키에는 `scripts/jev/translation-README.md`를 사용하세요. 문서 페이지는 먼저 `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`를 실행하세요. 이 명령은 로케일/페이지를 명시적으로 선택해야 하고, 구조 검증기를 실행하며, 실시간 추론이 활성화되기 전까지는 의미 검토를 미검증으로 보고합니다. `--live`는 작업에 대한 제공자 승인과 예산이 있을 때만 추가하세요. 자격 증명과 고정된 모델은 공유 비공개 머신 설정이 제공합니다. 환경 변수와 `--model`로 이 설정을 재정의할 수 있습니다. 이 명령은 번역을 절대 수정하지 않습니다.

페이지 어댑터는 페이지 전체의 컨텍스트를 보존하며, 각 페이지는 24 KB, 각 실행은 30쌍으로 제한합니다. 더 큰 페이지는 `translations.mjs --pairs`에 넘길 원문/번역 문단 쌍을 명시적으로 맞춰 준비하세요. 인덱스를 기준으로 문단을 자동으로 짝짓지 마세요. 의미 검토 결과는 권고 사항입니다. 보고된 문제와 불확실성을 확인하고, 결정론적인 코드/링크/주소 검사는 그대로 유지하세요.
