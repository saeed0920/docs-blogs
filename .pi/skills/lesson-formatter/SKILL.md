---
name: lesson-formatter
description: "Format raw lesson text into polished MDX for this Fumadocs docs site. Preserves original text verbatim. Adds frontmatter, context section, code examples, and Q&A accordion. Flags writing issues in an Agent Notes section at the bottom. Trigger: user says 'format this lesson', 'write this as MDX', 'turn this into a doc', or pastes raw lesson text."
---

# Lesson Formatter Skill

Converts raw lesson text → ready-to-publish Fumadocs MDX.

## Modes

- **Raw lesson formatting:** preserve supplied lesson text verbatim; add structure and teaching aids around it.
- **Existing-doc cleanup:** preserve meaning and working examples, but allow title, grammar, navigation, objective accuracy, and heading fixes. Never silently remove instructional content.

Choose existing-doc cleanup when user asks to clean, normalize, reorganize, or audit lessons already in `content/`.

## Input

User provides raw lesson text. May be:
- Bullet points / rough notes
- Paragraphs
- Mixed Persian/English
- Code snippets mixed with prose

Detect `dir` from content: if majority is Persian/RTL → `dir: rtl`.

## Output MDX Structure

For docs (`lpic1`, `git`, `front`), keep frontmatter minimal. Blog schema requires `date`.

```mdx
---
title: <concise title derived from content>
description: <one-sentence summary>
dir: <rtl only when needed>
---

import { Accordions, Accordion } from 'fumadocs-ui/components/accordion';

# <Topic Title>

<original text — word for word, untouched>

---

## Context

<1-3 short paragraphs: why this matters, where it fits in the bigger picture, real-world use>

---

## Example

<concrete code block or scenario that illustrates the lesson — clearly labeled as added example>

---

## Review Questions

<Accordions>
  <Accordion title="<Question 1>">
    <answer>
  </Accordion>
  <Accordion title="<Question 2>">
    <answer>
  </Accordion>
  <Accordion title="<Question 3>">
    <answer>
  </Accordion>
</Accordions>

---

## Agent Notes

> These are suggestions only. Review and delete this section before publishing.

- **[issue type]:** <specific observation and suggested fix>
```

## Rules

### Preserve
- In raw lesson formatting mode, every word, punctuation mark, and code snippet from original text stays unchanged.
- In existing-doc cleanup mode, preserve instructional meaning, runnable commands, and authored examples; report any substantial removal.
- Use one `#` page title, then sequential `##` and `###` headings.

### Add
- **Frontmatter**: infer title and description. Add `date`, `tags`, and `author` only for blog posts; add `dir: rtl` only for RTL content.
- **Context**: explain WHY this topic matters; connect to adjacent concepts
- **Example**: one focused, runnable (or clearly illustrative) example. If original already has good examples, say "see above" and add one more edge case
- **Review Questions**: 3 questions minimum. Mix factual recall + application + "why/when" type

### Flag (in Agent Notes)
Only flag real issues:
- Factual errors or outdated information
- Missing prerequisite context that would confuse a learner
- Ambiguous phrasing that could teach wrong mental model
- Code that won't run as written
- Missing important edge cases for the topic

Do NOT flag: style preferences, word choice, tone, length.

### Fumadocs Components Available
Default markdown components and `Callout`, `Cards`, and `Card` need no import in this project. Custom components still need imports.

- `<Callout type="info|warn|error">` — for important notes
- `<Accordions><Accordion title="...">` — import from `fumadocs-ui/components/accordion` for Q&A
- `<Tabs><Tab>` — for multi-language or alternative examples
- Standard markdown tables, code fences with language tags

### File Placement
Infer directory and slug when request or surrounding course makes them clear. Ask only when placement is genuinely ambiguous. Use descriptive lesson slugs (`system-architecture.mdx`, `package-management.mdx`), not generic topic-number hubs. Update course `meta.json` navigation and roadmap links.

## Example Transformation

**Input:**
```
nginx reverse proxy config
server block listens on 80
proxy_pass to localhost:3000
need to set headers for websockets
```

**Output:**
```mdx
---
title: Nginx Reverse Proxy with WebSocket Support
description: Configure Nginx as a reverse proxy forwarding HTTP and WebSocket traffic to a local app.
---

import { Accordions, Accordion } from 'fumadocs-ui/components/accordion';

# Nginx Reverse Proxy Config

nginx reverse proxy config
server block listens on 80
proxy_pass to localhost:3000
need to set headers for websockets

---

## Context

A reverse proxy sits in front of your app server...
[etc]
```

## Quality Check Before Writing File

1. Original text section matches input exactly (diff mentally)
2. Review questions test the lesson, not general knowledge
3. Agent Notes only lists real blockers, not style opinions
4. Frontmatter matches target collection schema and content direction
5. One H1, sequential heading hierarchy, valid internal links
6. Course `meta.json` includes lesson in logical learning order
