# DeepSeek Harness → Claude Opus 5.5-grade output

Research + customization menu for your harness. Compiled 2026-10-30 from live inspection of
your `web` profile, the DSH plugin ecosystem, and current model benchmarks.

---

## 1. The target: what "Claude Opus 5.5" actually means

Claude Opus 5.5 shipped **Sep 22, 2026** ([announcement](https://www.anthropic.com/claude-opus-5-5),
[benchmarks](https://benchgecko.ai/model/claude-opus-5-5)). The quality bar you named:

| Benchmark | Opus 5.5 | Notes |
|---|---|---|
| Terminal-Bench 4.0 (agentic coding) | **66.4%** | at `xhigh` effort; GPT-6 Astra: 57.9% |
| FrontierCode v1.1 | 54.4% | beats Astra at ~20% of cost/task |
| CursorBench 4.0 | 57.8% | |
| Humanity's Last Exam (with tools) | 67.7% | |
| OSWorld 2.1 (computer use) | 81.8% | |

Two facts matter for your goal:

1. **Anthropic's own scores use "adaptive thinking at max effort."** Their number-1 quality
   lever is *reasoning budget*, not prompt tricks. The DeepSeek equivalent is the
   `reasoning_effort` parameter ([DeepSeek thinking-mode guide](https://api-docs.deepseek.com/guides/thinking_mode.md)).
2. Anthropic itself says at this tier **"benchmark margins have become a less reliable guide
   to real-world differences"** — and third-party research shows the *harness* moves the same
   model's score by 11–27 points (see §3).

## 2. Where your harness stands today (live config I read)

- **Model:** `deepseek-v4-pro` via `deepseek-official`, **`reasoningEffort: max`** — already the
  strongest official DeepSeek setup (your profile patch, Oct 30).
- **DeepSeek V4** ([release](https://api-docs.deepseek.com/news/news260424.md)): 1M context,
  open-source SOTA agentic coding; Flash ≈ Pro on simple tasks, Pro leads on hard ones.
- **Effort mapping** (official): `minimal/low`→low, `medium/high/xhigh`→high, `max/ultra`→max.
  So `max` is the only tier above the default `high` — you're already at the ceiling.
- **Custom providers:** `llm-pi-ai` is active with a local Ollama `qwen3-coder:30b`. The schema
  supports `openai-completions`, `openai-responses`, **and `anthropic-messages`** — i.e., DSH can
  literally run Claude-family models through any Anthropic-compatible endpoint/gateway.
- **Preset:** shipped `standard` (persona, AGENTS.md instructions, bash/fs/jobs tools, skills,
  plan mode, goals, subagents, web, workflows, compaction).
- **Already customized:** `oh-my-dsh` (dsh-webui-enhance, dsh-agent-swarm, dsh-badgeboard) and a
  legacy `.agent-presets/swarm` preset (old format — migratable).

## 3. The honest gap model

Two separate gaps, two separate fixes:

**A. Model floor (the residual gap).** V4 Pro is open-source SOTA agentic coding, but Opus 5.5
leads the agentic-coding leaderboards by a real margin (Terminal-Bench 4.0: 66.4% vs ~58% for the
next-best non-Anthropic models). No harness configuration makes V4 Pro *be* Opus 5.5. What a
harness can do is recover a meaningful slice of the gap — and if you want literal parity, DSH can
route **Claude Opus 5.5 itself** through a custom provider (see §5-D).

**B. Harness scaffold (the recoverable gap).** The 2026 study
["Model Rankings Reverse Across Agent Harnesses"](https://agentpatterns.ai/patterns/agent-design/model-rankings-reverse-across-harnesses/)
([arXiv:2610.00917](https://arxiv.org/abs/2610.00917v1)) — which tested DeepSeek Harness among
others — found:

- The same Claude Opus 5 scored **57.14% → 30.16%** on Terminal-Bench 4 just by swapping harnesses
  (OpenHands → PI); model rankings *reversed* across harnesses.
- Most of the swing comes from **failure-return behavior**: bounded shell timeouts, resumable
  runs, and returning errors in a form the model can repair. "Models start almost all repairs
  themselves, so much depends on whether the harness hands failures back in a form the model can
  use."
- DeepSeek V4 Pro specifically moved *less* across harnesses on Terminal-Bench than on other
  suites — i.e., its score is more stable, but per-model harness tuning is still the open axis.
- Conclusion of the field: **tune and benchmark the model+harness configuration you ship, not
  the model alone.**

So the practical playbook: max effort (done) + better loop scaffolding + a small eval harness to
measure your own tasks.

## 4. Quality levers, ranked by leverage

1. **Reasoning effort** — done (`max`). Revisit only if cost hurts: `high` is the default tier
   below max and is notably cheaper.
2. **Loop discipline** — plan → verify → retry-with-reflection. This is where DSH's weakest
   default vs Claude Code's polish shows. Built-ins: plan mode, goals, subagents, todo tracking,
   compaction. Community upgrades: `dsh-gsd-bundle` (spec/discuss/plan/execute/verify/ship loop),
   `cleverer-dsh` (identical-retry interception, forced reflection, todo enforcement),
   `dsh-plans` (planner + criticizer-subagent rounds), `goal-acceptance` (acceptance-criteria
   gating).
3. **System-prompt authority** — DSH injects `AGENTS.md`/`CLAUDE.md` as a *user-role*
   `<system-reminder>`; the community's fix is Codex-style *system-level* injection
   (`dsh-default-prompt`, plus the built-in `persona` prefix/suffix). This measurably improves
   instruction adherence on long sessions.
4. **Failure-return & timeouts** — the arXiv study's single biggest harness factor. Keep
   tool-timeout policy on, keep `llm-retry` on, add auto-resume plugins if you run long
   unattended jobs (`dsh-continue`, `dsh-chat-continue`).
5. **Context hygiene** — quality decays as context fills. Built-ins: compaction + tool-result
   pruner (already mounted). Community: `dsh-compressor` (Headroom port, ~20% context savings),
   `dsh-context-doctor` (per-request token audit of AGENTS.md/skills/tools), `context-pruner`,
   `dsh-session-continuity` (cross-session handoff).
6. **Model routing** — strong model for hard turns, cheap model for utility work. Built-in
   subagent model selection exists; `dsh-plan-execute` splits planner (thinks) vs executor
   (acts); `dsh-model-router` adds failover across providers.
7. **Empirical tuning** — `dsh-dual-model-eval` / `dsh-agent-arena` run the same prompt across
   models in isolated git worktrees so you can *measure* which configuration wins on your tasks.

## 5. Customization menu — what other people are doing

The ecosystem is big: [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)
(1.1k★ curated catalog, mirrored at [dshbase](https://dshbase.com/zh/plugins/awesome-deepseek-harness/)),
the [Armory](https://github.com/deepseek-ai/deepseek-harness/discussions/5079) prompt/skill/MCP/theme
manager, and the `dsh-plugin` GitHub topic.

### A. Prompt & persona (most common quality customizations)
- [dsh-default-prompt](https://github.com/new-Beginner/dsh-default-prompt) — Codex-style
  `~/.dsh/DEFAULT_PROMPT.md` injected into the *real* system prompt, hot-reload, per-workspace
  overrides, `/prompt` commands. **Top community pick for quality.**
- [dsh-agent-persona](https://github.com/Awoodwhale/dsh-agent-persona) — per-workspace/session
  personas.
- Built-in: `persona` prefix/suffix + `dsh-system-prompt` personaPrefix/personaSuffix — zero-install
  alternative.
- [dsh-quality-lens](https://github.com/lishinho/dsh-quality-lens) — evidence-backed quality
  reports per answer.

### B. Reasoning-effort control
- [dsh-effort-tweak](https://github.com/Toukaiteio/dsh-effort-tweak) — Web UI page for per-model
  `reasoningEfforts` on custom providers (your Ollama route qualifies).
- [dsh-thinking-levels](https://github.com/drscrewdriver/dsh-thinking-levels) — reasoning-strength
  switching.
- Note: for official DeepSeek models, `reasoningEffort` is already a first-class setting
  (`agent-default-model`), no plugin needed.

### C. Agent-loop upgrades (plan/verify/reflection)
- [dsh-gsd-bundle](https://github.com/jaaty/dsh-gsd-bundle) — replaces the default loop with
  spec/discuss/plan/execute/verify/ship phases.
- [cleverer-dsh](https://github.com/Classicoke/cleverer-dsh) — 11 plugins + 6 skills of execution
  discipline.
- [dsh-plans](https://github.com/Optim-Agent/dsh-plans) — planning-first preset with reviewer
  subagents and verifier checklists.
- [dsh-plan-execute](https://github.com/dsh-external/dsh-plan-execute) — dual-model
  planner/executor routing.

### D. Running frontier models inside DSH (the literal-parity path)
- `llm-pi-ai` custom providers: `api: anthropic-messages` + baseURL of any Anthropic-compatible
  gateway, or `openai-responses`/`openai-completions` for OpenAI-family models.
- [dsh-agy-link](https://github.com/amlyczz/dsh-agy-link) / [dsh-antigravity](https://github.com/LiZhenNet/dsh-antigravity) —
  stream Gemini/Claude/GPT through a Google Antigravity subscription.
- [dsh-model-router](https://github.com/welsione/dsh-model-router) — one logical model id,
  multi-provider failover.
- [dsh-llm-compat-healer](https://github.com/Semidia/dsh-llm-compat-healer) — repairs
  `reasoning_content` replay and developer-role quirks on transit providers.

### E. Context & memory
- [dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) — what every request
  actually carries, with pruning tips.
- [dsh-compressor](https://github.com/lifeodyssey/dsh-compressor), [context-pruner](https://github.com/JohnXu22786/context-pruner),
  [dsh-context-compressor](https://github.com/qwert702/dsh-context-compressor).
- [dsh-session-continuity](https://github.com/ymck-x/dsh-session-continuity),
  [task-passport](https://github.com/dongsheng123132/task-passport) — durable state across sessions/harnesses.

### F. Migrating your Claude Code / Codex assets
- [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) — sessions, memories, skills,
  instructions, slash commands → DSH.
- [dsh-skill-mover](https://github.com/mjylfz/dsh-skill-mover) — one-click skill migration from
  14 agent platforms.

### G. Evaluation & tuning rigs
- [dsh-dual-model-eval](https://github.com/huangdaxianer/dsh-dual-model-eval),
  [dsh-agent-arena](https://github.com/LeemanCheung/dsh-agent-arena) — head-to-head in git worktrees.

### H. Everything else people customize
Themes/skins (dsh-theme-manager, dsh-premium-themes, Open Sea Skin), dashboards (dsh-usage,
dsh-token-usage, dsh-budget), TUIs and desktop shells, browser/computer-use, office/docs,
scheduled automation — browse the catalog for the full menu.

## 6. Recommended starting kit for *your* profile

| # | Change | Effort | Why |
|---|---|---|---|
| 1 | Keep `deepseek-v4-pro` @ `max` (done) | — | Ceiling reached on official models |
| 2 | Install `dsh-default-prompt` + write a global `DEFAULT_PROMPT.md` (reuse your `CLAUDE.md` rules) | 10 min | System-level rule authority; biggest prompt-side win |
| 3 | Add a frontier model as custom provider (`anthropic-messages` via your gateway of choice) for hard tasks; route with `dsh-plan-execute` or subagent model selection | 30 min | Literal Opus-level output where it matters |
| 4 | Install `dsh-context-doctor` + `dsh-compressor` | 15 min | Long-session quality is mostly context hygiene |
| 5 | Pick one loop upgrade: `dsh-gsd-bundle` **or** `cleverer-dsh` | 15 min | Plan/verify discipline is where DSH defaults lose to Claude Code |
| 6 | Set up `dsh-agent-arena` (or manual prompts) with 3–5 *your* tasks as a regression suite | 1 h | Measure configs on your workload, not leaderboards |
| 7 | Migrate the legacy `swarm` preset to the new declaration format (or drop it — built-in subagents cover it) | 15 min | Removes stale config risk |

## 7. What I can apply for you right now (needs your go-ahead)

Each of these changes your profile for **all sessions**, so I'll wait for your pick:

- [ ] Install `dsh-default-prompt` (+ seed `~/.dsh/DEFAULT_PROMPT.md` from your workspace rules)
- [ ] Create a custom **"opus-mode" agent preset** (persona + instructions + plan-first +
      verify-gate) via a bundle patch
- [ ] Add a frontier-model provider to `llm-pi-ai` (tell me the gateway/endpoint + key env)
- [ ] Install a context-hygiene pair (`dsh-context-doctor` + `dsh-compressor`)
- [ ] Install one loop-discipline bundle (`dsh-gsd-bundle` or `cleverer-dsh`)
- [ ] Migrate the legacy `swarm` preset
