# Import Path Fix Note

## Issue
The project's linter/formatter is automatically changing Excalidraw import paths between different formats:
- `'@excalidraw/excalidraw/types'` (correct, package.json exports)
- `'@excalidraw/excalidraw/types/types'` (incorrect, direct path)
- `'@excalidraw/excalidraw/types/element/types'` (incorrect, direct path)

## Correct Import Format

According to the Excalidraw package.json exports configuration, the correct import is:

```typescript
import type { ExcalidrawElement, AppState, BinaryFiles, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';
```

## Files That Need This Import

All whiteboard-related files should use the correct import:

1. `utils/whiteboardExport.ts` ✅ (fixed)
2. `components/whiteboard/WhiteboardControls.tsx` ✅ (fixed)
3. `components/whiteboard/WhiteboardCanvas.tsx` ⚠️ (keeps getting reverted by linter)
4. `components/whiteboard/WhiteboardTest.tsx` ⚠️ (keeps getting reverted by linter)
5. `hooks/useWhiteboardState.ts` ✅ (fixed)
6. `hooks/useWhiteboardState.example.tsx` ✅ (fixed)
7. `types/whiteboard.ts` ✅ (fixed)

## Solution

### Option 1: Fix Linter Configuration
Check `.eslintrc.json` or `eslint.config.js` and disable auto-fixing for import paths:

```json
{
  "rules": {
    "import/extensions": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  }
}
```

### Option 2: Manual Fix After Linting
After the linter runs, manually replace all occurrences:

```bash
# Find all incorrect imports
grep -r "@excalidraw/excalidraw/types/types" components/ hooks/ utils/

# Replace with correct import
find components/ hooks/ utils/ -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/@excalidraw\/excalidraw\/types\/types/@excalidraw\/excalidraw\/types/g'
find components/ hooks/ utils/ -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/@excalidraw\/excalidraw\/types\/element\/types/@excalidraw\/excalidraw\/types/g'
```

### Option 3: TypeScript Path Mapping
Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "paths": {
      "@excalidraw/excalidraw/types": ["./node_modules/@excalidraw/excalidraw/dist/types/excalidraw/index.d.ts"]
    }
  }
}
```

## Why This Matters

The Excalidraw package uses conditional exports in package.json:

```json
{
  "exports": {
    "./*": {
      "types": "./dist/types/excalidraw/*.d.ts"
    },
    ".": {
      "types": "./dist/types/excalidraw/index.d.ts",
      "default": "./dist/prod/index.js"
    }
  }
}
```

This means:
- ✅ `@excalidraw/excalidraw/types` - Resolves via package exports
- ❌ `@excalidraw/excalidraw/types/types` - Direct path, not in exports
- ❌ `@excalidraw/excalidraw/types/element/types` - Direct path, not in exports

## Verification

After fixing, run:

```bash
npm run build
```

Should compile without errors.

## Status

The Agent 3 files (`utils/whiteboardExport.ts` and `components/whiteboard/WhiteboardControls.tsx`) have been created with the correct imports. However, some existing Agent 1 files may need their imports corrected by the project maintainer or by adjusting the linter configuration.
