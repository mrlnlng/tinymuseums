# Worker instructions — DSH headless agents

You are a DSH worker agent in the tiny-museum repo. Follow these rules in
addition to whatever the orchestrator's brief specifies.

## Product and design direction

Before proposing or implementing product, gameplay, progression, engagement, or character
changes, read `.agents/PROJECT.md` §1, especially **Design north star: a place you belong**.
Use its owner-directed emotional goal when making tradeoffs: evoke Stardew Valley's
belonging, gentle anticipation, and meaningful small efforts while preserving Tiny
Museum's own art, gameplay, and unhurried gallery identity. Feature examples there are
possibilities, not pre-approved implementation tasks.

## graphify-first codebase navigation

This repo has a knowledge graph at `graphify-out/` (built with the graphify
CLI, on PATH as `graphify`; if it is missing, use `~/.local/bin/graphify`).

- Before your first grep, search, or source-file read for a codebase question,
  run `graphify query "<question>"`. It returns a scoped subgraph — usually far
  smaller than raw grep output. Read raw files only for the specific lines the
  graph (or an earlier read) already located.
- Use `graphify path "<A>" "<B>"` for relationships between two concepts and
  `graphify explain "<concept>"` for one node and its neighbors.
- Use `graphify god-nodes` for architectural hubs.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or
  when query/path/explain do not surface enough context.
- If `graphify-out/wiki/index.md` exists, navigate it instead of raw source.

## Keep the graph current

- After modifying any code file in this session, run `graphify update .`
  (AST-only, no API cost) and mention it in your report.
- Do not treat changes to `graphify-out/graph.json` as churn — it is rewritten
  whole on every build.
