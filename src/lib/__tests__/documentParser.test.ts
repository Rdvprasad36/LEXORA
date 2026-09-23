/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { parseUploadedFile } from '../documentParser';

describe('documentParser', () => {
  it('handles plain text file parsing correctly', async () => {
    const file = new File(['This is a test legal agreement content.'], 'agreement.txt', { type: 'text/plain' });
    const result = await parseUploadedFile(file);
    expect(result.text).toContain('This is a test legal agreement content.');
    expect(result.isImage).toBeFalsy();
  });

  it('handles image file parsing correctly', async () => {
    const blob = new Blob(['fake-image-bytes'], { type: 'image/jpeg' });
    const file = new File([blob], 'contract_scan.jpg', { type: 'image/jpeg' });
    const result = await parseUploadedFile(file);
    expect(result.isImage).toBe(true);
    expect(result.imageBase64).toBeDefined();
    expect(result.imageMimeType).toBe('image/jpeg');
  });
});
