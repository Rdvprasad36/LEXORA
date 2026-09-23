/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ParsedDocument {
  text: string;
  isImage?: boolean;
  imageBase64?: string;
  imageMimeType?: string;
}

export async function parseUploadedFile(file: File): Promise<ParsedDocument> {
  const fileName = file.name.toLowerCase();
  const mimeType = file.type;

  // 1. Image Files (.png, .jpg, .jpeg, .webp)
  if (mimeType.startsWith('image/') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.webp')) {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return {
      text: `[Uploaded Image Document: ${file.name}]\n(Image content submitted for OCR & Multimodal Legal Vision Analysis)`,
      isImage: true,
      imageBase64: base64,
      imageMimeType: mimeType || 'image/jpeg',
    };
  }

  // 2. Word Documents (.docx)
  if (fileName.endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 10) {
        return { text: `[Word Document: ${file.name}]\n\n` + result.value };
      }
    } catch (err) {
      console.warn('Mammoth docx extraction failed:', err);
    }
  }

  // 3. PDF Files (.pdf)
  if (fileName.endsWith('.pdf') || mimeType === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += `\n--- Page ${i} ---\n` + pageText;
      }
      if (fullText.trim().length > 10) {
        return { text: fullText };
      }
    } catch (err) {
      console.warn('PDF.js parsing warning:', err);
    }
  }

  // 4. Default / Text fallback
  try {
    const text = await file.text();
    if (text && text.length > 0) {
      return { text };
    }
  } catch {
    // ignore
  }

  return { text: `[Document: ${file.name}]\nCould not extract text automatically. Please verify content.` };
}
