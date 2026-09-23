/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for pdfjs-dist
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export async function extractTextFromPDFFile(file: File): Promise<string> {
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
      return fullText;
    }
    throw new Error('Extracted text was empty');
  } catch (err) {
    console.warn('PDF.js extraction failed or structure invalid, attempting raw buffer decode:', err);
    try {
      const text = await file.text();
      if (text && !text.includes('\u0000') && text.length > 20) {
        return text;
      }
    } catch {
      // ignore
    }

    // Fallback: extract readable string sequences from arrayBuffer
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let extracted = '';
      let currentSeq = '';
      for (let i = 0; i < bytes.length; i++) {
        const char = bytes[i];
        if (char >= 32 && char <= 126) {
          currentSeq += String.fromCharCode(char);
        } else {
          if (currentSeq.length > 4) {
            extracted += currentSeq + ' ';
          }
          currentSeq = '';
        }
      }
      if (currentSeq.length > 4) {
        extracted += currentSeq;
      }
      if (extracted.trim().length > 50) {
        return `[Raw Extracted Document Text from ${file.name}]\n\n` + extracted;
      }
    } catch (bufferErr) {
      console.error('Raw buffer extraction failed:', bufferErr);
    }

    return `[Document: ${file.name}]\nNote: The uploaded document has a binary or encrypted structure that could not be fully parsed into plain text. Please paste the text directly or use one of our prepared case studies.`;
  }
}

