# Testing & Prompt Versioning Guide

This document explains how to use the new testing framework and prompt versioning system in the legal-aid project.

## Prompt Versioning

### Overview

Prompts are now versioned and stored in `src/lib/prompts/versions.json`. Each prompt version includes:

- **version**: Semantic version (e.g., "1.0.0")
- **date**: ISO 8601 timestamp when version was created
- **description**: Human-readable description of the prompt
- **guardrailsVersion**: Linked guardrails version for traceability
- **changes**: Array of what changed in this version
- **systemPrompt**: The actual prompt template with `{CONTEXT}` placeholder

### Using Versioned Prompts

#### Current Prompt

```typescript
import { getCurrentPromptVersion } from "@/lib/prompts";

const version = getCurrentPromptVersion();
console.log(version.version); // "1.0.0"
console.log(version.systemPrompt); // Full prompt
```

#### Specific Version

```typescript
import { getPromptVersion } from "@/lib/prompts";

const v1 = getPromptVersion("1.0.0");
```

#### All Versions (for debugging/audit)

```typescript
import { getAllPromptVersions } from "@/lib/prompts";

const versions = getAllPromptVersions();
versions.forEach((v) => console.log(`${v.version}: ${v.description}`));
```

### Adding a New Prompt Version

1. Open `src/lib/prompts/versions.json`
2. Update `current` to the new version number
3. Add entry to `versions` array:

```json
{
  "version": "1.1.0",
  "date": "2026-03-22T10:30:00Z",
  "description": "Added explainer for legal aid assessment",
  "guardrailsVersion": "1.0.0",
  "changes": [
    "Clarified eligibility criteria",
    "Added assessment process explanation"
  ],
  "systemPrompt": "... your new prompt template here ..."
}
```

## Query Logging & Audit Trails

All queries are now logged with comprehensive metadata for compliance and debugging.

### What Gets Logged

Each query log includes:

- **timestamp**: ISO 8601 when query was processed
- **ipAddress**: Client IP (for rate limiting correlation)
- **userQuery**: The user's exact query
- **inScope**: Whether query passed guardrails
- **guardrailReason**: Why query was rejected (if applicable)
- **promptVersion**: Which prompt version was used
- **guardrailsVersion**: Which guardrails version was used
- **sourceCount**: Number of documents retrieved
- **responseLength**: Length of LLM response
- **error**: Any errors encountered

### Using Query Logs

```typescript
import { logQuery } from "@/lib/logging";

logQuery({
  ip: "192.168.1.1",
  query: "What is legal aid?",
  inScope: true,
  promptMetadata: {
    version: "1.0.0",
    timestamp: "2026-03-21T12:00:00Z",
    guardrailsVersion: "1.0.0",
  },
  sourceCount: 3,
  responseLength: 412,
});
```

### TODO: Send Logs to Backend

Currently logs print to console in development. To connect to a backend:

```typescript
// In src/lib/logging/index.ts, logQuery() function:

// TODO: Send to logging service (e.g., Supabase):
// await supabase.from('query_logs').insert([log])

// Or a centralized logging service (DataDog, Sentry, etc.)
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (rerun on file changes)
npm test -- --watch

# UI mode (interactive test runner)
npm test:ui

# Coverage report
npm test:coverage
```

### Test Structure

Tests are in `__tests__/` directory:

- **prompts.test.ts**: Tests for prompt versioning system
  - ✓ Current version retrieval
  - ✓ Specific version lookup
  - ✓ All versions listing
  - ✓ Guardrails compliance (citations, case-specific advice, reading level)

- **prompt-builder.test.ts**: Tests for prompt generation
  - ✓ PromptResult structure
  - ✓ Source inclusion and formatting
  - ✓ Guardrail enforcement
  - ✓ Metadata handling
  - ✓ Edge cases (empty chunks)

- **logging.test.ts**: Tests for query logging
  - ✓ Log structure and fields
  - ✓ Accepted vs rejected queries
  - ✓ Metadata tracking
  - ✓ Error handling
  - ✓ Timestamp format

### Writing New Tests

Example test for a new feature:

```typescript
import { describe, it, expect } from "vitest";

describe("Feature Name", () => {
  it("should do something", () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Testing Guardrails

Always test that guardrails are enforced:

```typescript
it("should enforce citation format", () => {
  const result = buildPrompt(chunks);
  expect(result.systemPrompt).toContain("[[Source:");
});

it("should prohibit outside knowledge", () => {
  const result = buildPrompt(chunks);
  expect(result.systemPrompt.toLowerCase()).toContain("only");
});
```

## Regression Testing Workflow

When making changes to prompts or guardrails:

1. **Run existing tests**:

   ```bash
   npm test
   ```

2. **Add test for new behavior**:

   ```bash
   npm test -- --watch
   ```

   (Keep tests running while developing)

3. **Update prompt version** in `versions.json` if changes made

4. **Add changelog entry** to `changes` array

5. **Verify all tests pass** before committing

## Tracking Prompt Changes

The `versions.json` serves as your prompt changelog. When adding new versions:

- Increment [semantic version](https://semver.org/): MAJOR.MINOR.PATCH
  - MAJOR: Breaking changes to guardrails
  - MINOR: New guardrails or improvements
  - PATCH: Clarifications or wording fixes

- Update `guardrailsVersion` if guardrails classification changed

- Document all changes in `changes` array

- Update `date` to current ISO 8601 timestamp

## Example: Adding a Guardrail

1. Update prompt in `versions.json` (increment version to 1.1.0)
2. Add test in `__tests__/prompt-builder.test.ts`
3. Run `npm test` to verify
4. Update chat endpoint if needed
5. Commit with message: "feat: add new guardrail for X (v1.1.0)"

## Next Steps

### Immediate

- [ ] Connect query logs to Supabase `query_logs` table
- [ ] Set up audit dashboard to review logged queries
- [ ] Configure log retention policy

### Future

- [ ] Add prompt performance metrics (response time, token usage)
- [ ] Implement A/B testing for prompt versions
- [ ] Add automated regression tests against real queries
- [ ] Create prompt testing harness for comparing versions

---

**Questions?** Check the code in:

- `src/lib/prompts/` — Versioning system
- `src/lib/logging/` — Query logging
- `__tests__/` — Test examples
