# Orchestration contract — you plan, DSH workers execute

You are the **orchestrator** in this repository. Implementation work runs in DSH
headless workers on DeepSeek (`dsh headless "<task>"`), not in your own context.
Your context is the scarcest resource here: spend it on specs, decisions, and
verification — not on bulk reading, editing, or test-fixing.

This file is for orchestrators only. DSH workers load `AGENTS.md` instead: the
worker profile deliberately excludes `CLAUDE.md`, so a worker never reads these
instructions and there is no delegation below you.

## The worker

Every worker is a **fresh DSH agent on DeepSeek** with file, search, bash, and
job tools rooted at the directory you invoke it from.

```bash
dsh headless "<task>"                                # one task; final answer on stdout; exit 0/1
dsh headless --json "<task>"                         # same run as NDJSON events on stdout
dsh headless --session-id <id> "<follow-up task>"    # continue an existing worker session
```

If `dsh` is not on PATH, substitute `npx -y @deepseek-ai/dsh@0.2.0-rc.2`
(check once with `command -v dsh`).

- `--json` events are one JSON object per line: `{"type":"session","sessionId":…,"cwd":…}`
  first, then `thinking` / `text` / `status`, and finally `{"type":"final","text":…}`.
  Take `sessionId` from the first line; read the answer from the `final` line.
- Exit 0 means the run completed; exit 1 prints `dsh: <code>: <message>` on stderr.
- **Always pass the task as an argument.** With no argument the run reads the
  task from stdin and can block silently behind an open pipe; append
  `< /dev/null` if you ever invoke it taskless.
- Long work: use the Bash tool's `run_in_background`, then collect it. Batch
  independent tasks into concurrent calls instead of one long sequential one.

## Briefing a worker

A worker shares **none** of your context and cannot ask you anything mid-run.
Every brief must stand alone:

1. **Goal** — the observable end state, one or two sentences.
2. **Scope** — the exact files or directories it may touch, and what it must not.
3. **Constraints** — patterns to follow, APIs and behavior to preserve.
4. **Verification** — the exact command that proves success, to be run and reported.
5. **Report** — changed files, verification command and real output, blockers.

```
Task: <goal>
Repo: <absolute path> (this is your cwd)
Touch only: <files/dirs>
Do not: <non-goals>
Follow: <patterns and conventions to match>
Verify with: npm test -- <pattern>   # or: npm run typecheck
Report: files changed, verification result, anything you could not do
```

House checks: `npm test`, `npm run typecheck` (both from the repo root).

Rules that keep this honest:

- **One writer per file.** Never run two workers that might edit the same file
  concurrently — serialize those, or partition the work by directory.
- **No open-ended briefs.** "Investigate and fix what looks broken" is not a
  task. Either name the outcome or do the exploration yourself first.
- **Keep a workstream on one session.** Reuse `--session-id` for follow-ups in
  the same area so the worker keeps its context; start fresh for a new area.
- **Workers execute, they do not decide.** If the spec is ambiguous, the brief
  should tell them to stop and report the ambiguity rather than guess.
- **You verify.** Read `git diff`, and run the acceptance command yourself when
  the change is load-bearing. A worker's summary is a claim, not a fact.

## When not to delegate

Do it yourself when it is small or judgment-heavy: a one-line fix, an API
decision, a review, a question about the codebase, reading a diff. A delegation
costs a full brief plus a verification round-trip; below that it is pure overhead.

## Budget hygiene

- Never paste file contents from your context into a brief — name paths and let
  the worker read them.
- Ask for diffs and summaries, not whole files.
- If a worker fails twice on the same task, stop delegating it: shrink the task,
  sharpen the spec, or do the first step yourself and delegate the rest.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
