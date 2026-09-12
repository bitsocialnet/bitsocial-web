---
name: improve-threejs
description: Review or improve a requested Three.js or React Three Fiber rendering flow.
---

<!-- Generated from .agents/skills/improve-threejs/SKILL.md; run yarn ai-workflow:sync. -->

# Three.js review

Identify the affected scene, render loop, and requested outcome. For an audit, return evidence without edits; for an improvement request, fix verified problems within scope. Prioritize observed frame cost, GPU resource lifetime, and visible rendering defects.

Read [scene review](references/scene-review.md) for frame-loop, disposal, camera/material, and visual checks relevant to the task. Use the installed React Doctor only when its diagnostics help; scores are not a target. Preserve deliberate animation and reduced-motion behavior.

Verify a visual claim against a rendered frame or label it as a source inference. Browser work follows the shared session lock. Recheck affected interactions using comparable settings, and report measured outcomes and remaining limitations.
