# Epic 5: Image Processing & OCR

**Epic ID:** EPIC-5
**Priority:** P1 (High)
**Estimated Time:** 8-10 hours
**Dependencies:** EPIC-2 (Chat System), EPIC-3 (Socratic Engine)
**Parallel Work:** Can be split across 2 agents

---

## Overview

Enable students to upload math problem images via screenshot or photo. Implement image validation, compression, preview UI, and integrate OpenAI Vision API for OCR to extract problem text. Handle both printed and handwritten equations.

---

## Success Criteria

- ✅ Accept images: .jpg, .png, .webp (up to 5MB)
- ✅ Image compression before upload (target <1MB)
- ✅ Drag-and-drop and file picker upload
- ✅ Image preview before sending
- ✅ OCR extracts printed text with 95%+ accuracy
- ✅ OCR extracts clear handwritten text with 80%+ accuracy
- ✅ Extracted text displays in conversation
- ✅ Graceful error handling for unclear images
- ✅ Mobile-friendly upload experience

---

## User Stories

### Story 5.1: Image Upload UI & Validation
**File:** `docs/stories/story-5.1-image-upload-ui.md`
**Estimated Time:** 3 hours
**Agent Assignment:** Frontend DEV Agent #1
**Dependencies:** EPIC-2 complete

Add image upload button to ChatInput, implement drag-and-drop zone, create ImagePreview component, validate file type and size, compress images before upload, and handle multiple images in conversation.

---

### Story 5.2: Vision API Integration & OCR
**File:** `docs/stories/story-5.2-vision-ocr.md`
**Estimated Time:** 5 hours
**Agent Assignment:** Backend DEV Agent #2 (parallel)
**Dependencies:** EPIC-2 and EPIC-3 complete

Integrate OpenAI Vision API (GPT-4 Vision), update API route to handle multimodal messages, convert images to base64, create vision-specific prompts for math problem extraction, handle printed vs handwritten text, and implement error handling for unclear images.

---

## Technical Specifications

### File Handling
- **Accepted Formats:** .jpg, .jpeg, .png, .webp
- **Max File Size:** 5MB (before compression)
- **Target Compressed Size:** <1MB
- **Compression Library:** browser-image-compression

### Component Structure
```
components/chat/
  ├── ImagePreview.tsx       # Preview selected image
  └── ChatInput.tsx          # Updated with upload button

utils/
  ├── fileValidator.ts       # Validate file type/size
  ├── imageCompression.ts    # Compress images
  └── imageToBase64.ts       # Convert for API

lib/
  └── vision.ts              # Vision API helpers

prompts/
  └── visionPrompt.ts        # OCR extraction prompt
```

### Multimodal Message Format
```typescript
{
  role: "user",
  content: [
    {
      type: "text",
      text: "What math problem is in this image?"
    },
    {
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${base64Image}`
      }
    }
  ]
}
```

### Vision Prompt Template
```markdown
You are analyzing a math problem from an image.

TASK:
1. Extract all mathematical expressions and equations
2. Convert to plain text or LaTeX notation
3. Preserve problem structure and context
4. If handwritten, interpret carefully

OUTPUT FORMAT:
- Use LaTeX for equations: $2x + 5 = 13$
- Preserve problem numbering/labels
- Include all relevant context

If unclear or cannot read:
- Request clearer photo
- Ask specific clarifying questions
```

### API Route Updates
```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json();

  // Detect if any message contains images
  const hasImages = messages.some(m =>
    Array.isArray(m.content) &&
    m.content.some(c => c.type === 'image_url')
  );

  const model = hasImages ? 'gpt-4-vision-preview' : 'gpt-4-turbo';

  // ... rest of implementation
}
```

---

## Testing Checklist

### Image Upload
- [ ] File picker works on desktop
- [ ] File picker works on mobile
- [ ] Drag-and-drop works
- [ ] File type validation (reject .gif, .pdf)
- [ ] File size validation (reject >5MB)
- [ ] Compression reduces size
- [ ] Preview displays correctly
- [ ] Remove image button works

### OCR Accuracy
- [ ] Printed simple equation: "2x + 5 = 13" (95%+ accuracy)
- [ ] Printed complex equation: "x² - 5x + 6 = 0" (95%+ accuracy)
- [ ] Printed word problem (90%+ accuracy)
- [ ] Clear handwritten simple equation (80%+ accuracy)
- [ ] Clear handwritten complex equation (75%+ accuracy)
- [ ] Geometry diagram with labels (70%+ accuracy)

### Error Handling
- [ ] Blurry image → request clearer photo
- [ ] No math visible → polite error message
- [ ] Upside-down image → ask to rotate
- [ ] Poor lighting → suggest better lighting
- [ ] Network error → graceful retry option

### Integration
- [ ] Extracted text appears in conversation
- [ ] Socratic dialogue continues after extraction
- [ ] Image thumbnail shows in history
- [ ] Can click image to view full size

### Mobile Experience
- [ ] Camera access works on mobile
- [ ] Photo library access works
- [ ] Upload speed reasonable on 4G
- [ ] Preview doesn't break layout

---

## Files to Create/Modify

### New Files
- `components/chat/ImagePreview.tsx`
- `utils/fileValidator.ts`
- `utils/imageCompression.ts`
- `utils/imageToBase64.ts`
- `lib/vision.ts`
- `prompts/visionPrompt.ts`

### Modified Files
- `components/chat/ChatInput.tsx` (add upload button)
- `components/chat/MessageBubble.tsx` (display images)
- `app/api/chat/route.ts` (handle multimodal messages)
- `types/conversation.ts` (extend message type)

### New Dependencies
```json
{
  "browser-image-compression": "^latest"
}
```

---

## Acceptance Criteria

1. Image upload works via file picker and drag-and-drop
2. File validation prevents invalid uploads
3. Images compress to reasonable size
4. Preview displays before sending
5. Vision API extracts printed equations with 95%+ accuracy
6. Vision API extracts clear handwriting with 80%+ accuracy
7. Extracted text flows into Socratic conversation
8. Error messages are helpful and specific
9. Works on mobile browsers (iOS Safari, Android Chrome)
10. Image thumbnails persist in conversation history

---

## OCR Quality Benchmarks

| Image Type | Target Accuracy | Notes |
|------------|----------------|-------|
| Printed simple equations | 95-100% | "2x + 5 = 13" |
| Printed complex notation | 90-95% | Fractions, exponents, roots |
| Printed word problems | 85-95% | Text + equations |
| Clear handwritten | 75-85% | Legible writing |
| Messy handwritten | 60-70% | May need clarification |
| Geometry diagrams | 70-80% | Labels and dimensions |

---

## Related PRs from Original PRD

- **PR #6:** Image Upload and Preview
- **PR #7:** Vision LLM Integration with OpenAI - OCR

---

## Notes

- Vision API has higher latency than text-only
- Show "Analyzing image..." loading state
- Consider caching extracted text with image
- Story 5.1 and 5.2 can work mostly in parallel
- Test with real-world photos (not just clean screenshots)
- Mobile camera quality varies significantly

---

## Risk Mitigation

**Medium Risk:** OCR accuracy too low for handwritten problems
- **Mitigation:** Start with printed text, iterate on handwriting, provide manual entry fallback

**Medium Risk:** Large images slow down upload
- **Mitigation:** Aggressive compression, show upload progress

**Low Risk:** Mobile permissions issues
- **Mitigation:** Clear permission requests, fallback options

---

**Status:** Ready for Development
**Last Updated:** November 7, 2025
