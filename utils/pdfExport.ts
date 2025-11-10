import jsPDF from 'jspdf';
import type { Conversation } from '@/types/conversation';

/**
 * Convert LaTeX to more readable plain text
 * Exported so it can be used for voice reading and other features
 */
export function latexToPlainText(text: string): string {
  let result = text;

  // Remove display and inline math markers
  result = result.replace(/\$\$/g, '');
  result = result.replace(/\$/g, '');

  // Convert fractions: \frac{a}{b} → (a)/(b)
  result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');

  // Convert common symbols
  result = result.replace(/\\times/g, '×');
  result = result.replace(/\\div/g, '÷');
  result = result.replace(/\\pm/g, '±');
  result = result.replace(/\\leq/g, '≤');
  result = result.replace(/\\geq/g, '≥');
  result = result.replace(/\\neq/g, '≠');
  result = result.replace(/\\approx/g, '≈');
  result = result.replace(/\\pi/g, 'π');
  result = result.replace(/\\infty/g, '∞');
  result = result.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');

  // Convert superscripts: ^{n} → ^n
  result = result.replace(/\^\{([^}]+)\}/g, '^$1');
  result = result.replace(/\^(\w)/g, '^$1');

  // Convert subscripts: _{n} → _n
  result = result.replace(/_\{([^}]+)\}/g, '_$1');
  result = result.replace(/_(\w)/g, '_$1');

  // Remove remaining backslashes and braces for common commands
  result = result.replace(/\\text\{([^}]+)\}/g, '$1');
  result = result.replace(/\\left\(/g, '(');
  result = result.replace(/\\right\)/g, ')');
  result = result.replace(/\\left\[/g, '[');
  result = result.replace(/\\right\]/g, ']');
  result = result.replace(/\\\(/g, '(');
  result = result.replace(/\\\)/g, ')');
  result = result.replace(/\\\[/g, '[');
  result = result.replace(/\\\]/g, ']');

  // Clean up extra spaces and backslashes
  result = result.replace(/\\/g, '');
  result = result.replace(/\s+/g, ' ');

  return result.trim();
}

/**
 * Export a conversation to PDF
 */
export async function exportConversationToPDF(conversation: Conversation): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (heightNeeded: number) => {
    if (yPosition + heightNeeded > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number): string[] => {
    return pdf.splitTextToSize(text, maxWidth);
  };

  // Add header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Gandalf Math Tutor', margin, yPosition);
  yPosition += 10;

  // Add conversation title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  const titleLines = wrapText(conversation.title, contentWidth);
  titleLines.forEach((line) => {
    checkPageBreak(7);
    pdf.text(line, margin, yPosition);
    yPosition += 7;
  });
  yPosition += 3;

  // Add metadata
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const date = new Date(conversation.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  pdf.text(`Date: ${date}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Messages: ${conversation.messages.length}`, margin, yPosition);
  yPosition += 10;

  // Add separator line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Add messages
  pdf.setTextColor(0, 0, 0);

  for (let i = 0; i < conversation.messages.length; i++) {
    try {
      const message = conversation.messages[i];
      const isUser = message.role === 'user';

      // Extract text content from parts
      const textParts = message.parts
        .filter((part) => part.type === 'text')
        .map((part) => 'text' in part ? part.text : '')
        .join('');

    // Find image if present
    const imagePart = message.parts.find((part) => part.type === 'file' && 'url' in part);
    const imageUrl = imagePart && 'url' in imagePart ? (imagePart as any).url : null;

    // Add role label
    checkPageBreak(15);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');

    if (isUser) {
      pdf.setTextColor(37, 99, 235); // Blue for user
      pdf.text('You:', margin, yPosition);
    } else {
      pdf.setTextColor(79, 70, 229); // Indigo for AI
      pdf.text('AI Tutor:', margin, yPosition);
    }
    yPosition += 6;

    // Add message content
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);

    // Add image if present
    if (imageUrl) {
      try {
        // Load image to get its natural dimensions
        const img = new Image();
        img.src = imageUrl;

        // Wait for image to load to get dimensions
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load image'));
        });

        // Calculate dimensions while maintaining aspect ratio
        const maxWidth = contentWidth - 10; // Leave some margin
        const maxHeight = 100; // Max height in mm (about 1/3 of page)

        const aspectRatio = img.width / img.height;
        let imageWidth = maxWidth;
        let imageHeight = imageWidth / aspectRatio;

        // If height exceeds max, scale down based on height instead
        if (imageHeight > maxHeight) {
          imageHeight = maxHeight;
          imageWidth = imageHeight * aspectRatio;
        }

        checkPageBreak(imageHeight + 10);

        // Add image to PDF with proper aspect ratio
        pdf.addImage(imageUrl, 'JPEG', margin + 5, yPosition, imageWidth, imageHeight, undefined, 'FAST');
        yPosition += imageHeight + 5;
      } catch (error) {
        console.error('Failed to add image to PDF:', error);
        // Fallback to text indicator
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 100, 100);
        pdf.text('[Image attached - could not embed]', margin + 5, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
      }
    }

    if (textParts.trim()) {
      // Convert LaTeX to readable plain text
      const cleanedText = latexToPlainText(textParts);

      const messageLines = wrapText(cleanedText, contentWidth - 5);

      messageLines.forEach((line) => {
        checkPageBreak(5);
        pdf.text(line, margin + 5, yPosition);
        yPosition += 5;
      });
    }

    yPosition += 5; // Space between messages

    // Add separator for readability
    if (i < conversation.messages.length - 1) {
      checkPageBreak(3);
      pdf.setDrawColor(230, 230, 230);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
    }
    } catch (error) {
      // Continue with next message instead of failing entirely
      console.error(`Error processing message ${i}:`, error);
    }
  }

  // Add footer on last page
  yPosition = pageHeight - margin + 5;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.setFont('helvetica', 'italic');
  const footer = 'Generated by Gandalf Math Tutor - Learn through Socratic questioning';
  pdf.text(footer, pageWidth / 2, yPosition, { align: 'center' });

  // Try to use File System Access API for save dialog
  // Falls back to regular download if not supported
  try {
    // Check if File System Access API is available
    if ('showSaveFilePicker' in window) {
      const pdfBlob = pdf.output('blob');

      const handle = await (window as any).showSaveFilePicker({
        suggestedName: 'gandalf_math_chat.pdf',
        types: [{
          description: 'PDF Files',
          accept: { 'application/pdf': ['.pdf'] },
        }],
      });

      const writable = await handle.createWritable();
      await writable.write(pdfBlob);
      await writable.close();
    } else {
      // Fallback to regular download
      pdf.save('gandalf_math_chat.pdf');
    }
  } catch (error) {
    // User cancelled or error occurred, fallback to regular download
    if ((error as Error).name !== 'AbortError') {
      pdf.save('gandalf_math_chat.pdf');
    }
    // If AbortError, user cancelled - don't download anything
  }
}

/**
 * Export multiple conversations to a single PDF
 */
export async function exportMultipleConversationsToPDF(
  conversations: Conversation[],
  filename: string = 'gandalf_conversations.pdf'
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let isFirstConversation = true;

  for (const conversation of conversations) {
    if (!isFirstConversation) {
      pdf.addPage();
    }
    isFirstConversation = false;

    // Add conversation (simplified version)
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(conversation.title, margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const date = new Date(conversation.updatedAt).toLocaleDateString();
    pdf.text(`Date: ${date}`, margin, yPosition);
    yPosition += 10;

    pdf.setTextColor(0, 0, 0);
    pdf.text(`${conversation.messages.length} messages`, margin, yPosition);
    yPosition += 10;
  }

  pdf.save(filename);
}
