### Changed
- Wire the catalogue guard `enforce-pr-opened-via-skill` (v1.0.0, sha256 b27529bd…6bac) as a PreToolUse Bash hook: a raw `gh pr create` is refused, a PR opens only through the open-pr skill.
