# iai.one-platform Partial Cross-Machine Handoff

- **Status:** `PARTIAL_RECOVERY_HANDOFF`
- **Remote base:** `main@c4992477a774b37541a94a1eadb07544c39174de`
- **Local historical HEAD:** `29d94c9527b06ed66ccf7430c35203ed82808c81`
- **Branch:** `OMCODE/partial-cross-machine-handoff-20261103`
- **Release authority:** none

This branch preserves eight readable local WIP files on top of current remote `main`. The historical local commit object was unavailable from the FileProvider-backed local repository and is not present in current GitHub refs, so this is a file-level recovery snapshot rather than a merge-ready reconstruction.

Included paths:

```text
.gitignore
content/QA_AUDIT_FINAL_2026-07-10.md
content/TODO_AFTER_QA_FINAL_2026-07-10.md
content/iai-live-surfaces-qa-registry.md
scripts/team1-iai-live-surfaces-probe.mjs
apps/api-flow-stub/package.json
apps/api-flow-stub/src/worker.ts
apps/api-flow-stub/wrangler.toml
```

Blocked path:

```text
package.json - FileProvider dataless, not uploaded, worktree metadata differs from index
```

Do not merge or deploy this branch as a complete feature. Review each recovered file against remote `main`, recover the blocked `package.json`, run a complete secret scan and project tests, then create a normal implementation PR.

Validation before publication:

```text
recognized raw-secret scan on 9 staged files=PASS (0 findings)
git diff --check=FAIL (pre-existing Markdown hard-break trailing spaces in recovered audit documents)
project install/tests=NOT_RUN (blocked package.json unavailable)
```
