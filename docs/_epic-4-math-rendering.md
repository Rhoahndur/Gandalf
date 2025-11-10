# Epic 4: Math Rendering with LaTeX

**Epic ID:** EPIC-4
**Priority:** P0 (Blocker)
**Estimated Time:** 3-4 hours
**Dependencies:** EPIC-2 (Chat System)
**Parallel Work:** Can be done by 1 agent in parallel with EPIC-3

---

## Overview

Integrate KaTeX library for rendering mathematical notation in LaTeX format. Parse LLM responses for inline and display math modes, handle mixed content (text + equations), and ensure proper styling across light/dark modes.

---

## Success Criteria

- ✅ Inline math renders correctly: `$2x + 5 = 13$`
- ✅ Display math renders correctly: `$$E = mc^2$$`
- ✅ Mixed content (text + math) displays properly
- ✅ Fractions, exponents, square roots render accurately
- ✅ No visual glitches or layout breaks
- ✅ Works in light and dark mode
- ✅ Graceful fallback for invalid LaTeX
- ✅ Performance: No lag with multiple equations

---

## User Stories

### Story 4.1: KaTeX Integration & Math Renderer Component
**File:** `docs/stories/story-4.1-katex-integration.md`
**Estimated Time:** 2 hours
**Agent Assignment:** Frontend DEV Agent (can work parallel to EPIC-3)
**Dependencies:** EPIC-2 complete

Install KaTeX library, create MathRenderer component that accepts content string and renders LaTeX equations using KaTeX, handle inline and display math modes, and add error handling for invalid LaTeX.

---

### Story 4.2: LaTeX Parser & Integration
**File:** `docs/stories/story-4.2-latex-parser.md`
**Estimated Time:** 1.5 hours
**Agent Assignment:** Same Frontend DEV Agent
**Dependencies:** Story 4.1

Create LaTeX parser utility to split text by math delimiters (`$...$` and `$$...$$`), handle escaped delimiters, integrate parser with MessageBubble component, and test with complex mixed content.

---

## Technical Specifications

### Library
- **KaTeX:** https://katex.org/
- Fast math rendering library
- No external dependencies
- Server-side rendering capable

### Installation
```bash
npm install katex
npm install @types/katex -D
```

### Component Structure
```
components/math/
  └── MathRenderer.tsx      # Main renderer component

utils/
  └── latexParser.ts        # Parse LaTeX delimiters
```

### MathRenderer Component
```typescript
interface MathRendererProps {
  content: string;  // Text with embedded LaTeX
}

// Parses content for:
// - Inline math: $...$
// - Display math: $$...$$
// - Regular text
```

### Parser Output Format
```typescript
type ContentSegment = {
  type: 'text' | 'inline-math' | 'display-math';
  content: string;
};

function parseLatex(text: string): ContentSegment[];
```

---

## Testing Checklist

### Basic Equations
- [ ] Inline: "Solve $2x + 5 = 13$"
- [ ] Display: "Formula: $$E = mc^2$$"
- [ ] Mixed: "First $x = 4$, then $$y = 2x$$"

### Complex Notation
- [ ] Fractions: "$\frac{1}{2} + \frac{2}{3}$"
- [ ] Exponents: "$x^2 + 5x + 6 = 0$"
- [ ] Square roots: "$\sqrt{16} = 4$"
- [ ] Subscripts: "$a_1, a_2, ..., a_n$"
- [ ] Greek letters: "$\alpha, \beta, \theta$"

### Edge Cases
- [ ] Invalid LaTeX (should show error message)
- [ ] Escaped delimiters: "\\$not math\\$"
- [ ] Multiple equations in one message
- [ ] Very long equations
- [ ] Empty delimiters: "$$ $$"

### Styling
- [ ] Font size matches surrounding text
- [ ] Centered display equations
- [ ] Proper vertical spacing
- [ ] Good contrast in light mode
- [ ] Good contrast in dark mode
- [ ] No horizontal overflow

### Performance
- [ ] No lag with 10+ equations per message
- [ ] Smooth scrolling with equations
- [ ] No re-render flashing

---

## Files to Create/Modify

### New Files
- `components/math/MathRenderer.tsx`
- `utils/latexParser.ts`

### Modified Files
- `components/chat/MessageBubble.tsx` (integrate MathRenderer)
- `app/globals.css` (add KaTeX CSS import)
- `package.json` (add KaTeX dependency)

### CSS Import
```typescript
// app/layout.tsx or globals.css
import 'katex/dist/katex.min.css';
```

---

## Acceptance Criteria

1. All test equations render correctly
2. Inline and display math modes work
3. Parser handles complex mixed content
4. Invalid LaTeX shows user-friendly error
5. Styling consistent across themes
6. No performance degradation
7. Accessibility: equations have alt text
8. Mobile responsive: equations don't overflow
9. Copy/paste works (copies LaTeX source)
10. Integration with MessageBubble seamless

---

## Example LaTeX Patterns to Support

### Algebra
- `$2x + 5 = 13$`
- `$3(x + 2) - 4 = 17$`
- `$x^2 - 5x + 6 = 0$`

### Fractions & Ratios
- `$\frac{1}{2} + \frac{2}{3}$`
- `$\frac{a}{b} = \frac{c}{d}$`

### Geometry
- `$A = \frac{1}{2}bh$`
- `$\pi r^2$`
- `$\theta = 45°$`

### Advanced
- `$\sqrt{x^2 + y^2}$`
- `$\sum_{i=1}^{n} i$`
- `$\int_{0}^{1} x^2 dx$`

---

## Related PRs from Original PRD

- **PR #5:** Math Rendering with LaTeX

---

## Notes

- **Can work in parallel with EPIC-3** (different domain)
- KaTeX is faster than MathJax (better choice)
- Error handling is critical (invalid LaTeX shouldn't crash)
- Test with actual LLM outputs (may include unexpected formatting)
- Consider adding "Copy LaTeX" button in future

---

## Risk Mitigation

**Low Risk:** KaTeX rendering errors
- **Mitigation:** Try-catch wrapper, fallback to raw text

**Low Risk:** Performance with many equations
- **Mitigation:** KaTeX is fast, but test with stress scenarios

---

**Status:** Ready for Development
**Last Updated:** November 7, 2025
