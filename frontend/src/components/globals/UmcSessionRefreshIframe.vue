<!--
  Copyright 2021-2024 Univention GmbH

  https://www.univention.de/

  All rights reserved.

  The source code of this program is made available
  under the terms of the GNU Affero General Public License version 3
  (GNU AGPL V3) as published by the Free Software Foundation.

  Binary versions of this program provided by Univention to you as
  well as other copyrighted, protected or trademarked materials like
  Logos, graphics, fonts, specific documentations and configurations,
  cryptographic keys etc. are subject to a license agreement between
  you and Univention and not subject to the GNU AGPL V3.

  In the case you use this program under the terms of the GNU AGPL V3,
  the program is provided in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License with the Debian GNU/Linux or Univention distribution in file
  /usr/share/common-licenses/AGPL-3; if not, see
  <https://www.gnu.org/licenses/>.
-->

<template>
  <iframe
    v-if="refreshNeeded"
    src="/univention/saml/iframe/"
    title="UMC session refresh iframe"
    style="position: absolute; width: 0; height: 0; border: 0"
    @load="onLoad"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import { getResultFromIframe } from './UmcSessionRefreshIframe.utils';

export default defineComponent({
  name: 'UmcSessionRefreshIframe',
  data() {
    return {
      onLoadCounter: 0,
    };
  },
  computed: {
    ...mapGetters({
      refreshNeeded: 'umcSession/refreshNeeded',
    }),
  },
  beforeUpdate() {
    if (!this.refreshNeeded) {
      this.onLoadCounter = 0;
    }
  },
  methods: {
    onLoad() {
      this.onLoadCounter += 1;
      if (this.onLoadCounter === 2) {
        this.handleRefreshResult();
      }
    },

    handleRefreshResult() {
      const result = getResultFromIframe(this.$el);
      if (result?.status === 200) {
        this.$store.dispatch('umcSession/restartSessionRefresh');
      } else {
        this.$store.dispatch('umcSession/disableSessionRefresh');
      }
    },
  },
});

</script>

<style lang="stylus">
</style>
