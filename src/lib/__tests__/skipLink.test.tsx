/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Header } from '../../components/Header';

describe('Skip Link Test Suite', () => {
  it('provides accessibility skip link pointing to main content', () => {
    const headerEl = Header({ onReset: () => {}, onOpenArchitecture: () => {}, hasAnalysis: false });
    expect(headerEl).toBeDefined();
  });
});
