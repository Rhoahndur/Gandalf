# Whiteboard Components Documentation

This directory contains components for the interactive whiteboard feature using Excalidraw.

## Components

### WhiteboardControls.tsx

A comprehensive control toolbar for the Excalidraw whiteboard that provides:

- **Clear Whiteboard**: Remove all drawings with confirmation dialog
- **Export to PNG**: Download whiteboard as PNG image
- **Export to SVG**: Download whiteboard as vector SVG
- **Copy to Clipboard**: Copy whiteboard as PNG to clipboard
- **Zoom Controls**: Zoom in, zoom out, and reset zoom
- **Grid Toggle**: Show/hide grid overlay

#### Props

```typescript
interface WhiteboardControlsProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles | null;
  conversationTitle?: string;
  onClear?: () => void;
  className?: string;
}
```

#### Usage Example

```tsx
import WhiteboardControls from '@/components/whiteboard/WhiteboardControls';
import { Excalidraw } from '@excalidraw/excalidraw';
import { useState } from 'react';

export default function WhiteboardCanvas() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [elements, setElements] = useState([]);
  const [appState, setAppState] = useState({});
  const [files, setFiles] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      <WhiteboardControls
        excalidrawAPI={excalidrawAPI}
        elements={elements}
        appState={appState}
        files={files}
        conversationTitle="Math Problem 1"
        onClear={() => console.log('Whiteboard cleared')}
      />

      <div className="h-[600px] border rounded-lg">
        <Excalidraw
          ref={(api) => setExcalidrawAPI(api)}
          onChange={(elements, appState, files) => {
            setElements(elements);
            setAppState(appState);
            setFiles(files);
          }}
        />
      </div>
    </div>
  );
}
```

## Utilities

### whiteboardExport.ts

Located at `utils/whiteboardExport.ts`, this module provides export functions:

#### Functions

1. **exportToPNG**
   ```typescript
   async function exportToPNG(
     elements: readonly ExcalidrawElement[],
     appState: Partial<AppState>,
     files: BinaryFiles | null = null,
     fileName?: string
   ): Promise<void>
   ```
   Exports whiteboard to PNG format and triggers download.

2. **exportToSVG**
   ```typescript
   async function exportToSVG(
     elements: readonly ExcalidrawElement[],
     appState: Partial<AppState>,
     files: BinaryFiles | null = null,
     fileName?: string
   ): Promise<void>
   ```
   Exports whiteboard to SVG format and triggers download.

3. **exportToImageBlob**
   ```typescript
   async function exportToImageBlob(
     elements: readonly ExcalidrawElement[],
     appState: Partial<AppState>,
     files: BinaryFiles | null = null,
     mimeType: string = 'image/png'
   ): Promise<Blob>
   ```
   Returns a Blob for advanced use cases (e.g., uploading to server).

4. **generateWhiteboardFilename**
   ```typescript
   function generateWhiteboardFilename(
     conversationTitle?: string,
     timestamp?: number,
     extension: 'png' | 'svg' = 'png'
   ): string
   ```
   Generates a formatted filename based on conversation context.

   Examples:
   - `whiteboard_math_problem_1_2025-11-09_14-30-45.png`
   - `whiteboard_2025-11-09_14-30-45.svg`

5. **copyToClipboard**
   ```typescript
   async function copyToClipboard(
     elements: readonly ExcalidrawElement[],
     appState: Partial<AppState>,
     files: BinaryFiles | null = null
   ): Promise<void>
   ```
   Copies whiteboard as PNG to the system clipboard.

## Integration with WhiteboardCanvas

When Agent 1 creates the `WhiteboardCanvas.tsx` component, it should:

1. **Import the controls component:**
   ```typescript
   import WhiteboardControls from './WhiteboardControls';
   ```

2. **Maintain state for Excalidraw:**
   ```typescript
   const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
   const [elements, setElements] = useState<readonly ExcalidrawElement[]>([]);
   const [appState, setAppState] = useState<Partial<AppState>>({});
   const [files, setFiles] = useState<BinaryFiles | null>(null);
   ```

3. **Pass API reference to Excalidraw:**
   ```typescript
   <Excalidraw
     ref={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
     onChange={(elements, appState, files) => {
       setElements(elements);
       setAppState(appState);
       setFiles(files);
     }}
   />
   ```

4. **Render controls above or beside the canvas:**
   ```typescript
   <div className="whiteboard-container">
     <WhiteboardControls
       excalidrawAPI={excalidrawAPI}
       elements={elements}
       appState={appState}
       files={files}
       conversationTitle={currentConversation?.title}
     />
     <div className="excalidraw-wrapper">
       <Excalidraw ... />
     </div>
   </div>
   ```

## Styling

The components use Tailwind CSS and are fully responsive:

- **Desktop**: Horizontal toolbar with all buttons visible
- **Tablet**: Horizontal toolbar with icon-only buttons
- **Mobile**: Wraps into multiple rows as needed

### Customization

You can customize the appearance by:

1. **Adding className prop:**
   ```tsx
   <WhiteboardControls className="shadow-lg border-2" ... />
   ```

2. **Modifying button styles** in `WhiteboardControls.tsx`

3. **Replacing SVG icons** with lucide-react icons:
   ```typescript
   import { Download, Trash, ZoomIn, ZoomOut, RotateCcw, Grid } from 'lucide-react';
   ```

## Dependencies

- `@excalidraw/excalidraw` - Core whiteboard library (already installed)
- `react` - For component rendering
- `tailwindcss` - For styling

Optional:
- `lucide-react` - For better icon library (can replace built-in SVG icons)

## Features

### Confirmation Dialog

The clear button shows a custom modal dialog for confirmation:
- Modern, centered modal with overlay
- Clear warning message
- Cancel and Confirm buttons
- Prevents accidental data loss

### Loading States

All export operations show loading states:
- Disabled buttons during export
- Loading spinner animation
- "Exporting..." text indicator

### Error Handling

All operations include error handling:
- Try-catch blocks for async operations
- User-friendly error messages via alerts
- Console error logging for debugging

### Accessibility

- Proper button titles for tooltips
- Disabled states for unavailable actions
- Keyboard accessible (Tab navigation)
- Screen reader friendly

## Browser Support

- **PNG/SVG Export**: All modern browsers
- **Copy to Clipboard**: Chrome 76+, Edge 79+, Safari 13.1+, Firefox 87+
- **File Download**: All modern browsers

## Performance Notes

1. **Export operations** are async and may take 1-2 seconds for complex drawings
2. **Large whiteboards** (100+ elements) may have slower export times
3. **SVG exports** are smaller file size but may not include embedded images
4. **PNG exports** are higher quality and include all content

## Future Enhancements

Potential improvements for future iterations:

1. Add export to PDF
2. Save/load whiteboard state from localStorage
3. Share whiteboard via URL
4. Undo/redo controls
5. Layer controls
6. Shape templates
7. Collaborative editing (real-time sync)

## Troubleshooting

### Export buttons disabled

- Check that `elements` array is not empty
- Ensure `excalidrawAPI` is not null

### Clipboard copy fails

- Browser may not support Clipboard API
- User may need to grant clipboard permissions
- Try using PNG download as fallback

### Grid not showing

- Check that `excalidrawAPI` is initialized
- Grid may be hidden by Excalidraw's internal settings

## Testing Checklist

- [ ] Clear button shows confirmation dialog
- [ ] Clear button resets the canvas
- [ ] PNG export downloads file with correct name
- [ ] SVG export downloads file with correct name
- [ ] Copy to clipboard works (test paste in image editor)
- [ ] Zoom in increases canvas scale
- [ ] Zoom out decreases canvas scale
- [ ] Reset zoom returns to 100%
- [ ] Grid toggle shows/hides grid
- [ ] All buttons disabled when no elements on canvas
- [ ] Loading states shown during export
- [ ] Responsive layout works on mobile
- [ ] Icons render correctly
- [ ] Tooltips show on hover
