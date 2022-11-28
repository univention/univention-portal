/*
 * Copyright 2021-2022 Univention GmbH
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
import { createApp } from 'vue';
import App from '@/App.vue';
import { store } from '@/store';
import { router } from '@/router';
import localize from '@/plugins/localize';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import '@/assets/styles/style.styl';
import addCustomStyles from '@/jsHelper/addCustomStyles';

addCustomStyles();

declare global {
    interface Window {
        store: any;
    }
}
window.store = store;

const app = createApp(App)
  .use(localize)
  .use(router)
  .use(store)
  .use(VueDOMPurifyHTML, {
    hooks: {
      afterSanitizeAttributes: (currentNode) => {
        // Do something with the node
        // set all elements owning target to target=_blank
        if ('target' in currentNode) {
          currentNode.setAttribute('target', '_blank');
          currentNode.setAttribute('rel', 'noopener');
        }
      },
    },
  });

const vm = app.mount('#app');
export default vm;