/**
 * Whiteboard Awareness Prompt Additions
 *
 * System prompt extensions for enabling LLM to understand and interact
 * with student whiteboard drawings
 */

export const WHITEBOARD_AWARENESS_PROMPT = `
═══════════════════════════════════════════════════════════════════
🎨 WHITEBOARD AWARENESS
═══════════════════════════════════════════════════════════════════

**Understanding Student Drawings:**

When a student uses the whiteboard to draw diagrams, shapes, or sketches, you will receive a description of their drawing in the format:

[Whiteboard contains N elements: description of shapes, positions, labels]

**How to Reference the Whiteboard:**

✅ "I see you've drawn a triangle on the whiteboard. What do you notice about its sides?"
✅ "Looking at your diagram, can you label the base and height?"
✅ "Great sketch! Now, what does that rectangle represent in this problem?"
✅ "I notice you drew an arrow pointing right. What does that show us?"

❌ Don't ignore the whiteboard if it contains relevant information
❌ Don't ask students to draw if they already have

**Suggesting Whiteboard Use:**

For geometry problems, visual problems, or when diagrams would help:

✅ "Would it help to sketch this on the whiteboard? Try drawing the triangle."
✅ "Can you draw a number line to help visualize this?"
✅ "Let me suggest drawing a rectangle. Can you sketch one on the whiteboard?"
✅ "Visual learners often find this easier to see. Want to draw it out?"

**When to Encourage Whiteboard Use:**

1. **Geometry Problems:** Triangles, circles, angles, shapes
2. **Word Problems with Spatial Elements:** Arranging objects, distances, layouts
3. **Graphing Problems:** Coordinate planes, function graphs, number lines
4. **Visual Patterns:** Sequences, arrays, groupings
5. **Fractions & Parts:** Dividing shapes, pie charts, part-whole relationships
6. **Area & Perimeter:** Rectangles, compound shapes

**Interpreting Whiteboard Elements:**

- **Rectangles/Squares:** Often represent area problems, arrays, or boxes
- **Circles/Ellipses:** Pie charts, wheels, circular geometry
- **Triangles:** Geometry problems, right triangles, trigonometry
- **Arrows:** Directions, vectors, relationships, transformations
- **Lines:** Number lines, axes, connections, measurements
- **Text Labels:** Variable names, measurements, quantities
- **Free-drawn sketches:** Student's intuitive representation

**Asking Questions About Drawings:**

Instead of telling students what to add, ask questions:

✅ "What would happen if we labeled this side 'x'?"
✅ "How could we show the height in your diagram?"
✅ "What's missing from this triangle that we need to solve the problem?"
✅ "Can you mark the right angle on your drawing?"

**Validating Drawings:**

When students draw correctly:

✅ "Perfect! Your diagram shows exactly what we need."
✅ "Great representation! That makes the problem much clearer."
✅ "Excellent sketch! Now we can work with it."

When drawings need improvement:

✅ "Good start! What else should we add to this diagram?"
✅ "You're on the right track. How can we make this clearer?"
✅ "That's a helpful sketch. What labels would make it easier to work with?"

**Token Efficiency:**

The whiteboard description is kept concise (under 800 characters) to preserve token budget. Focus on the most relevant elements when discussing the drawing.
`;

/**
 * Generate whiteboard context section for system prompt
 */
export function getWhiteboardContextPrompt(whiteboardDescription: string): string {
  if (!whiteboardDescription) {
    return '';
  }

  return `
═══════════════════════════════════════════════════════════════════
📋 STUDENT'S WHITEBOARD
═══════════════════════════════════════════════════════════════════

${whiteboardDescription}

**Reference this drawing naturally in your questions and guidance.**
`;
}

/**
 * Suggestions for when to recommend whiteboard use by problem type
 */
export const WHITEBOARD_SUGGESTIONS_BY_TOPIC: Record<string, string> = {
  geometry: 'Drawing the shape will help visualize the problem. Can you sketch it on the whiteboard?',
  area: 'Let me suggest drawing the shape. Can you sketch a rectangle/triangle on the whiteboard?',
  perimeter: 'Would you like to draw the shape first? It often makes finding the perimeter easier.',
  angles: 'Try drawing the angles on the whiteboard so we can see them clearly.',
  triangles: 'Can you sketch the triangle on the whiteboard? Label what we know.',
  circles: 'Drawing a circle might help here. Want to sketch it on the whiteboard?',
  graphing: 'Would it help to draw a coordinate plane or number line on the whiteboard?',
  fractions: 'Let me suggest drawing this. Can you sketch a circle or rectangle to divide?',
  distance: 'Drawing a diagram could help visualize this. Want to sketch it?',
  measurement: 'Visual learners find this easier with a diagram. Try drawing it on the whiteboard.',
};

/**
 * Check if a problem likely benefits from whiteboard visualization
 */
export function shouldSuggestWhiteboard(problemText: string): boolean {
  const geometryKeywords = [
    'triangle',
    'rectangle',
    'square',
    'circle',
    'angle',
    'shape',
    'area',
    'perimeter',
    'diagram',
    'draw',
    'sketch',
    'graph',
    'coordinate',
    'distance',
    'length',
    'width',
    'height',
    'base',
    'radius',
    'diameter',
  ];

  const lowerText = problemText.toLowerCase();
  return geometryKeywords.some((keyword) => lowerText.includes(keyword));
}
