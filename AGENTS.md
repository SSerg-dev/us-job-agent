# US Job Agent working instructions

## Efficiency gate before loading project documents
Apply these rules before reading additional Markdown files or starting a workflow.
- Work in small, bounded steps; read only relevant files and sections. Reuse already loaded context instead of repeating reads.
- Keep responses concise. Avoid unnecessary agents, exhaustive document loading, unrelated refactoring, and repeated failed commands.
- Validate changes with focused tests first; run broader checks only when warranted. Do not sacrifice correctness or required instructions to save usage.
- Higher reasoning effort does not guarantee correctness. Use it only when task complexity warrants it; do not change models or account settings without user authorization.
- Prefer standard speed over Fast for usage conservation. The currently documented Fast multiplier is 2.5x included subscription usage; verify current documentation before relying on this figure for a new recommendation.
- Subscription usage depends on model, task complexity, and context size, not token count alone. Monitor actual account usage windows; do not promise exact token savings or a hard cutoff.

## Development workflow
- Use locally installed .codex/skills/gsd-*/SKILL.md and GSD Core workflows.
- English Angular/Tailwind UI, local Node/SQLite, independent TypeScript domain.
- No site automation, applications, external AI, telemetry or private HH data copy.
- No commits, branches, model changes or subagents without explicit approval.
- Execute 01-01 only until its human tracer checkpoint is accepted; do not start 01-02 automatically.

## Account usage reserve
Apply this policy before loading additional project Markdown documents for substantial work and before starting implementation.
- Read the account usage tool before substantial work, before every GSD phase or costly agent batch, after such batches, and approximately every 10 minutes during sustained work. Never poll in a tight loop.
- Interpret usedPercent as consumed usage; remaining is 100 minus usedPercent. These are shared Codex account limits, not an exact remaining token count or a ChatGPT message-limit reading.
- Track the five-hour and weekly windows independently. Report remaining percentages for both when available, with each window's reset time in Europe/Moscow. Never infer an unavailable window from the other window or reuse an old reading as current.
- Default reserve: 30% remaining in each of the five-hour and weekly windows. The lower remaining percentage governs whether new work may start; sufficient capacity in one window does not override the reserve in the other. This is a working policy, not a platform-enforced hard cap; the user can adjust it.
- At 40% remaining or less in either window, inform the user of the approaching reserve.
- At 30% remaining or less in either window, stop initiating implementation or agent work. Save a brief continuation checkpoint and report remaining usage and reset times in Europe/Moscow. Resume only after a fresh reading confirms both windows are above the reserve or the user explicitly authorizes consuming the reserve.
- If usage cannot be read, disclose that limitation and do not initiate a long autonomous batch until a reading or user direction is available.
- Checks cannot guarantee a hard cutoff; a running turn or other chats can consume usage between checks.
- Do not buy credits, use reset credits, change models, or create recurring monitoring automations without user authorization.
