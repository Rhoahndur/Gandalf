# Whiteboard Controls Testing Guide

This guide provides comprehensive testing procedures for the WhiteboardControls component and export utilities.

## Pre-Testing Setup

### Requirements
- Node.js installed
- All dependencies installed (`npm install`)
- Development server running (`npm run dev`)
- Browser with developer tools open

### Browser Compatibility
Test in the following browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest, for macOS/iOS)

## Testing Checklist

### 1. Export to PNG

**Test Steps:**
1. Open the whiteboard
2. Draw some shapes (rectangles, circles, arrows)
3. Add some text elements
4. Click the "PNG" export button
5. Wait for the download

**Expected Results:**
- [ ] Button becomes disabled during export
- [ ] Loading spinner appears
- [ ] File downloads with format: `whiteboard_[conversation]_[date]_[time].png`
- [ ] PNG file opens correctly in image viewer
- [ ] All drawn elements are visible in the exported image
- [ ] Colors and styling match the canvas
- [ ] No cropping or clipping of elements
- [ ] Transparent background is preserved (if applicable)

**Edge Cases to Test:**
- [ ] Export empty whiteboard (button should be disabled)
- [ ] Export very large whiteboard (>100 elements)
- [ ] Export with only text elements
- [ ] Export with images embedded
- [ ] Export with custom fonts

### 2. Export to SVG

**Test Steps:**
1. Draw various elements on the whiteboard
2. Include text, shapes, and arrows
3. Click the "SVG" export button
4. Wait for the download

**Expected Results:**
- [ ] File downloads with format: `whiteboard_[conversation]_[date]_[time].svg`
- [ ] SVG file opens in browser correctly
- [ ] SVG can be opened in vector editing software (Illustrator, Inkscape)
- [ ] All elements are vector-based (scalable)
- [ ] Text is editable in SVG editor
- [ ] File size is reasonable (<1MB for typical drawings)

**Edge Cases:**
- [ ] Export with very complex paths (freedraw)
- [ ] Export with transparency
- [ ] Export with gradient fills (if supported)

### 3. Copy to Clipboard

**Test Steps:**
1. Draw elements on the whiteboard
2. Click the "Copy" button
3. Open an image editing application (Paint, Photoshop, etc.)
4. Paste (Ctrl+V / Cmd+V)

**Expected Results:**
- [ ] Button shows "Copied!" confirmation for 2 seconds
- [ ] Image pastes successfully into image editor
- [ ] Image pastes successfully into messaging apps (Slack, Discord)
- [ ] Image pastes successfully into documents (Google Docs, Word)
- [ ] Quality matches PNG export

**Browser Support Check:**
- [ ] Works in Chrome/Edge
- [ ] Works in Firefox
- [ ] Works in Safari (may have limitations)
- [ ] Shows appropriate error message if not supported

**Edge Cases:**
- [ ] Copy empty whiteboard (button should be disabled)
- [ ] Copy very large whiteboard
- [ ] Copy multiple times in succession

### 4. Clear Whiteboard

**Test Steps:**
1. Draw several elements on the whiteboard
2. Click the "Clear" button
3. Observe confirmation dialog
4. Click "Cancel"
5. Click "Clear" button again
6. Click "Clear Whiteboard" in dialog

**Expected Results:**
- [ ] Confirmation dialog appears with warning message
- [ ] Dialog has clear "Cancel" and "Clear Whiteboard" buttons
- [ ] Clicking "Cancel" closes dialog without clearing
- [ ] Clicking "Clear Whiteboard" removes all elements
- [ ] Canvas is completely blank after clearing
- [ ] `onClear` callback is triggered (check console)
- [ ] Button is disabled when canvas is empty

**Edge Cases:**
- [ ] Clear immediately after drawing (no delay issues)
- [ ] Clear with Excalidraw undo history preserved
- [ ] Multiple rapid clear attempts

### 5. Zoom Controls

#### Zoom In

**Test Steps:**
1. Start with default zoom (100%)
2. Click "Zoom In" button multiple times
3. Observe canvas zoom level

**Expected Results:**
- [ ] Canvas zooms in by ~20% each click
- [ ] Elements appear larger
- [ ] Maximum zoom stops at 300%
- [ ] Button becomes disabled at max zoom (optional enhancement)
- [ ] Smooth zoom transition

#### Zoom Out

**Test Steps:**
1. Zoom in first
2. Click "Zoom Out" button multiple times
3. Continue until minimum zoom

**Expected Results:**
- [ ] Canvas zooms out by ~20% each click
- [ ] Elements appear smaller
- [ ] Minimum zoom stops at 10%
- [ ] Button becomes disabled at min zoom (optional enhancement)

#### Reset Zoom

**Test Steps:**
1. Zoom in or out to any level
2. Click "Reset Zoom" button

**Expected Results:**
- [ ] Canvas immediately returns to 100% zoom
- [ ] Elements return to original size
- [ ] Canvas is centered

**Edge Cases:**
- [ ] Zoom with very large whiteboard
- [ ] Zoom with scrolled canvas
- [ ] Rapid zoom in/out clicks

### 6. Grid Toggle

**Test Steps:**
1. Observe initial grid state (should be enabled)
2. Click "Grid" button
3. Observe grid disappears
4. Click "Grid" button again

**Expected Results:**
- [ ] Grid is visible by default (20px spacing)
- [ ] Button is highlighted when grid is enabled
- [ ] Grid disappears when toggled off
- [ ] Grid reappears when toggled on
- [ ] Grid state persists during drawing
- [ ] Elements snap to grid when enabled (if applicable)

**Visual Check:**
- [ ] Grid lines are subtle and not distracting
- [ ] Grid size is appropriate for drawing

### 7. Responsive Layout

**Test on Desktop (1920x1080):**
- [ ] All buttons visible with labels
- [ ] Controls in single horizontal row
- [ ] Icons and text properly aligned
- [ ] Dividers visible between button groups

**Test on Tablet (768px):**
- [ ] Controls wrap appropriately
- [ ] Icons remain visible
- [ ] Text labels may hide on some buttons
- [ ] Touch targets are adequate (44px minimum)

**Test on Mobile (375px):**
- [ ] Controls stack or wrap into multiple rows
- [ ] All functionality remains accessible
- [ ] Icons are large enough to tap
- [ ] No horizontal scrolling required
- [ ] Modal dialog fits on screen

### 8. Loading States

**Test Steps:**
1. Draw a complex whiteboard (50+ elements)
2. Click PNG export
3. Observe loading state

**Expected Results:**
- [ ] Export button becomes disabled
- [ ] Loading spinner appears
- [ ] "Exporting..." text visible
- [ ] Other buttons remain enabled
- [ ] UI doesn't freeze
- [ ] Loading state clears after export

### 9. Error Handling

#### Export Errors

**Test Steps:**
1. Simulate export failure (browser DevTools → Network → Block specific requests)
2. Try to export

**Expected Results:**
- [ ] User-friendly error message appears
- [ ] Error is logged to console
- [ ] UI returns to normal state
- [ ] User can try export again

#### Clipboard Errors

**Test Steps:**
1. Test in browser without clipboard API support
2. Try to copy

**Expected Results:**
- [ ] Appropriate error message
- [ ] Suggests alternative (download PNG)
- [ ] Doesn't break the UI

### 10. Integration Testing

**Test with WhiteboardCanvas:**
1. Ensure WhiteboardCanvas passes correct props
2. Verify `excalidrawAPI` is not null
3. Check `elements`, `appState`, `files` update correctly
4. Confirm `onClear` callback fires

**Test Props:**
- [ ] `excalidrawAPI` is valid reference
- [ ] `elements` array updates on draw
- [ ] `appState` reflects current state
- [ ] `files` contains embedded images
- [ ] `conversationTitle` appears in filenames
- [ ] `onClear` callback is optional
- [ ] `className` prop applies correctly

### 11. Filename Generation

**Test Steps:**
1. Export with conversation title "Math Problem 1"
2. Export without conversation title
3. Export same conversation twice

**Expected Results:**
- [ ] With title: `whiteboard_math_problem_1_2025-11-09_14-30-45.png`
- [ ] Without title: `whiteboard_2025-11-09_14-30-45.png`
- [ ] Each export has unique timestamp
- [ ] Special characters in title are sanitized
- [ ] Very long titles are truncated to 30 chars
- [ ] Format is consistent: `whiteboard_[title]_[YYYY-MM-DD]_[HH-MM-SS].[ext]`

### 12. Performance Testing

**Benchmark Tests:**
1. Draw 10 elements → Export → Measure time
2. Draw 50 elements → Export → Measure time
3. Draw 100 elements → Export → Measure time
4. Draw 200 elements → Export → Measure time

**Expected Performance:**
- [ ] 10 elements: <500ms
- [ ] 50 elements: <1s
- [ ] 100 elements: <2s
- [ ] 200 elements: <5s
- [ ] No UI freezing during export
- [ ] Browser remains responsive

### 13. Accessibility Testing

**Keyboard Navigation:**
- [ ] Tab key navigates through all buttons
- [ ] Enter/Space activates buttons
- [ ] Escape closes confirmation modal
- [ ] Focus visible on all interactive elements

**Screen Reader:**
- [ ] Buttons have descriptive labels
- [ ] Modal dialog is announced
- [ ] Loading states are announced
- [ ] Disabled states are announced

**Visual:**
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Icons have text alternatives (title attribute)
- [ ] Focus indicators are visible
- [ ] Hover states are clear

### 14. Cross-Browser Testing

**Chrome/Edge:**
- [ ] All features work
- [ ] Clipboard API supported
- [ ] Export quality is high

**Firefox:**
- [ ] All features work
- [ ] Clipboard API supported (87+)
- [ ] Export quality matches Chrome

**Safari:**
- [ ] All features work
- [ ] Clipboard API supported (13.1+)
- [ ] Check for any rendering issues
- [ ] Test on iOS Safari

## Known Issues and Limitations

Document any issues found during testing:

1. **Issue:** [Description]
   - **Impact:** [Low/Medium/High]
   - **Workaround:** [If available]
   - **Status:** [Open/In Progress/Fixed]

## Automated Testing (Future)

Suggested test cases for automated testing:

```typescript
describe('WhiteboardControls', () => {
  it('should export to PNG with correct filename', async () => {
    // Test implementation
  });

  it('should show confirmation before clearing', () => {
    // Test implementation
  });

  it('should disable export buttons when no elements', () => {
    // Test implementation
  });

  // ... more tests
});
```

## Test Data

Use these test scenarios:

### Simple Drawing
- 5 rectangles
- 3 circles
- 2 text boxes with "Test"

### Complex Drawing
- 20+ mixed shapes
- Multiple text elements
- Arrows connecting shapes
- Different colors and styles

### Geometry Diagram
- Triangle with angle labels
- Coordinate grid
- Dimension lines

### Math Problem
- Equation written in text
- Work steps below
- Arrows showing flow

## Reporting Results

When testing is complete, report:
- Total tests passed / failed
- Browser compatibility matrix
- Performance benchmarks
- Any critical issues
- Screenshots of successful exports

## Sign-off

- [ ] All critical tests passed
- [ ] Documentation reviewed
- [ ] Example integration verified
- [ ] Ready for Agent 1 integration

**Tested by:** _______________
**Date:** _______________
**Browser versions:** _______________
