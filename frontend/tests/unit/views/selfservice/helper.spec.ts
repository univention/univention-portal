/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

import { WidgetDefinition } from '@/jsHelper/forms';
import { sanitizeFrontendValues } from '@/views/selfservice/helper';

const widgets: WidgetDefinition[] = [
  { type: 'ImageUploader', name: 'image', label: 'Image' },
  { type: 'MultiInput', name: 'multi', label: 'Multi' },
  { type: 'DateBox', name: 'date', label: 'Date' },
];

describe('sanitizeFrontendValues', () => {
  test('should remove empty arrays for MultiInput type widgets', () => {
    const values = { image: '', multi: ['value1', [], 'value2'], date: '2022-01-01' };
    const result = sanitizeFrontendValues(values, widgets);
    expect(result.multi).toEqual(['value1', 'value2']);
  });

  test('should remove null values for MultiInput type widgets', () => {
    const values = { image: '', multi: ['value1', null, 'value2'], date: '2022-01-01' };
    const result = sanitizeFrontendValues(values, widgets);
    expect(result.multi).toEqual(['value1', 'value2']);
  });

  test('should set null for empty strings for DateBox type widgets', () => {
    const values = { image: '', multi: ['value1'], date: '' };
    const result = sanitizeFrontendValues(values, widgets);
    expect(result.date).toBeNull();
  });
});
