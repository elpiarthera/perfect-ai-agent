### Changed
- Wire the catalogue guard `enforce-pr-opened-via-skill` (v1.0.0, sha256 b27529bd…6bac) as a PreToolUse Bash hook and carry the hook file in the repo (allowlisted in .gitignore) so a fresh clone runs it: a raw `gh pr create` is refused, a PR opens only through the open-pr skill.
