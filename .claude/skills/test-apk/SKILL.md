---
name: test-apk
description: Verify a requested companion Android wrapper or WebView flow on a local device.
---

<!-- Generated from .agents/skills/test-apk/SKILL.md; run yarn ai-workflow:sync. -->

# Android wrapper verification

Bitsocial Web is a web repository; it contains no Android application project. Identify the companion wrapper root, package ID, device/emulator, build/install commands, and exact flow from the request or supplied project. Report missing inputs rather than inventing an Android build here.

Inspect `adb devices` and use an explicit target when multiple devices exist. Run only the provided wrapper build/install commands, serialized with other heavy work. Reuse a compatible server and leave device/server lifecycle with its owner. Small checks can run locally; delegate a substantial independent check to `test-apk` with these inputs when useful.

Exercise the requested launch, routing/back-button, storage, keyboard, or asset-loading flow. Capture focused logcat and a screenshot for visible failures; report exact steps, device/build outcome, observed behavior, artifacts, and limitations. Do not reset device state, upload data, or expand to unrelated interactions without task authorization.
