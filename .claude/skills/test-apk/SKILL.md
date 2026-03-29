---
name: test-apk
description: Test and debug Android wrapper features for Bitsocial Web using a local Android emulator or attached device. Manages emulator lifecycle, builds and installs the wrapper when commands are provided, runs focused checks, captures logcat diagnostics, and debugs WebView or TWA behavior. Use when the user asks to test Android, debug WebView behavior, run emulator tests, or says "test-apk".
---

# Test Android Wrapper on an Emulator or Device

## Overview

Delegates Android testing to the dedicated `test-apk` subagent to keep the main context clean.

Bitsocial Web itself is a web repository and does not contain an Android project. This skill is for companion Android wrappers, WebView shells, or TWAs that load the local Bitsocial Web app.

## Step 1: Collect Requirements

Before delegating, gather or infer:

| Requirement               | Why it matters                         |
| ------------------------- | -------------------------------------- |
| Wrapper project root      | Needed for build and install commands  |
| App/package id            | Needed to launch the installed app     |
| Emulator or device target | Needed for `adb` and launch commands   |
| Build/install commands    | This repo does not define them         |
| Exact flow to test        | Prevents broad, low-signal exploration |

If any of those are missing and cannot be inferred safely, stop and ask for them instead of guessing.

## Step 2: Delegate to the `test-apk` Subagent

Spawn the `test-apk` subagent with a prompt like this, replacing the placeholders:

```text
You are testing a Bitsocial Web Android wrapper on a local emulator or attached device.

## Environment
- Android wrapper project: {WRAPPER_PROJECT_ROOT}
- App/package id: {APP_ID}
- Emulator or device target: {DEVICE_TARGET}
- Build and install commands: {BUILD_AND_INSTALL_COMMANDS}

## What to Test
{TEST_DESCRIPTION}

## Device Management

### Check if an emulator or device is available
adb devices

### If no target is available
Stop and report that the environment is missing instead of inventing setup steps.

## Build and Install

Run only the commands provided by the parent agent:
{BUILD_AND_INSTALL_COMMANDS}

## Run Tests
{TEST_COMMANDS}

## Diagnostics to Capture

- Focused logcat output relevant to the wrapper or WebView shell
- Screenshot on failure
- Reproducible failure steps
- Any visible WebView or routing errors

## Return Format

Return a structured summary:
1. Emulator/device status
2. Build result
3. Install result
4. Test results
5. Logcat highlights
6. Diagnosis
7. Artifacts
```

## Common Scenarios

| Scenario                          | What to run                                                           |
| --------------------------------- | --------------------------------------------------------------------- |
| WebView shell smoke test          | Launch app, open key routes, capture logcat                           |
| Routing and back-button debugging | Launch specific route, navigate, test Android back behavior           |
| Storage persistence debugging     | Relaunch app and verify local storage/cookie/session behavior         |
| Asset loading issues              | Capture logcat plus screenshot for failed asset or blank-screen cases |
| Manual shell interaction          | Build, install, launch, and capture diagnostics                       |

## Diagnostics to Prioritize

- logcat lines related to the wrapper app, Chromium/WebView, and app startup
- screenshots when the rendered result is visibly wrong
- routing mismatches, asset 404s, and storage/persistence failures
- keyboard overlap, safe-area issues, and back-button handling

## Rules

- Do not invent an Android project inside this repo.
- Do not guess build/install commands that were not provided.
- Keep the test focused on the user-requested flow.
- Leave the emulator or device running unless explicitly asked to stop it.
