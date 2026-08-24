# Fix word_count 149-170 (derive-command bug)

My derivation command `sed '1,/^---$/d;1,/^---$/d'` stripped the frontmatter AND the first body section, because the body contains `---` section separators — so every entry 149-170 was undercounted by one section. Corrected all EN+FR frontmatter to the robust value `awk 'seen>=2; /^---$/{seen++}' file | wc -w` (matches Pi's `sed '1,8d' | wc -w`). Non-rendered field; content untouched.
