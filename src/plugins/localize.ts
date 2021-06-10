/*
 * Copyright 2021 Univention GmbH
 *
 * https://www.univention.de/
 *
 * All rights reserved.
 *
 * The source code of this program is made available
 * under the terms of the GNU Affero General Public License version 3
 * (GNU AGPL V3) as published by the Free Software Foundation.
 *
 * Binary versions of this program provided by Univention to you as
 * well as other copyrighted, protected or trademarked materials like
 * Logos, graphics, fonts, specific documentations and configurations,
 * cryptographic keys etc. are subject to a license agreement between
 * you and Univention and not subject to the GNU AGPL V3.
 *
 * In the case you use this program under the terms of the GNU AGPL V3,
 * the program is provided in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License with the Debian GNU/Linux or Univention distribution in file
 * /usr/share/common-licenses/AGPL-3; if not, see
 * <https://www.gnu.org/licenses/>.
 */
// plugins/localize
import { Locale } from '@/store/modules/locale/locale.models';
import { App } from 'vue';
import { catalog } from '@/assets/data/dictionary';

import { store } from '../store';

export type Localized = (input: Record<Locale, string>) => string;
export type TranslateLabel = (translationLabel: string) => string;

// expects an object, returns a string
const localize = {
  install: (app: App): void => {
    const localized: Localized = (input: Record<Locale, string>) => {
      const curLocale = store.getters['locale/getLocale'];
      const shortLocale = curLocale.split('_')[0];
      let ret = '';

      if (input) {
        ret = input[curLocale] || input[shortLocale] || input.en || input.en_US || '';
      }
      return ret;
    };
    app.config.globalProperties.$localized = localized;

    // const translateLabel: TranslateLabel = (translationLabel: string) => catalog[translationLabel].translated.value;
    // app.config.globalProperties.$translateLabel = translateLabel;

    const newPlugin: TranslateLabel = (englishReference: string) => {
      console.log('englishReference', englishReference);
      console.log('catalog[englishReference].translated.value', catalog[englishReference].translated.value);
      return englishReference;
    };
    app.config.globalProperties.$getText = newPlugin;
  },
};

declare module '@vue/runtime-core' {
  // Bind to `this` keyword
  interface ComponentCustomProperties {
    $localized: Localized;
    $translateLabel: TranslateLabel;
    $getText: TranslateLabel;
  }
}

// Usage example:
// {{ $localized(label) }}
export default localize;
