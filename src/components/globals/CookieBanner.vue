<!--
  Copyright 2021 Univention GmbH

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
  <modal-dialog
    @cancel="cancel"
  >
    <div
      :class="fadeOutClass"
      class="cookie-banner"
    >
      <transition name="fade">
        <div
          class="cookie-banner__container"
          role="dialog"
          aria-labelledby=""
        >
          <div class="cookie-banner__title-bar">
            <span
              class="cookie-banner__title"
              role="heading"
              level="1"
            >
              {{ $localized(metaData.cookieBanner.title) || defaultCookieTitle }}
            </span>
          </div>
          <div class="cookie-banner__pane-content">
            <div class="cookie-banner__container-widget">
              <div
                v-dompurify-html="$localized(metaData.cookieBanner.text) || defaultCookieText"
                class="cookie-banner__text"
              />
            </div>
          </div>
          <div class="cookie-banner__action-bar">
            <button
              class="primary"
              @click.stop="setCookies()"
            >
              <translate i18n-key="ACCEPT" />
            </button>
          </div>
        </div>
      </transition>
    </div>
  </modal-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import Translate from '@/i18n/Translate.vue';
import ModalDialog from '@/components/ModalDialog.vue';

import { catalog } from '@/i18n/translations';
import { setCookie } from '@/jsHelper/tools';

interface CookieBannerData {
  fadeOutClass: string,
}

export default defineComponent({
  name: 'CookieBanner',
  components: {
    ModalDialog,
    Translate,
  },
  data(): CookieBannerData {
    return { fadeOutClass: '' };
  },
  computed: {
    ...mapGetters({ metaData: 'metaData/getMeta' }),
    cookieName(): string {
      return this.metaData.cookieBanner.cookie || 'univentionCookieSettingsAccepted';
    },
    defaultCookieTitle(): string {
      return catalog.COOKIE_TITLE.translated.value;
    },
    defaultCookieText(): string {
      return catalog.COOKIE_TEXT.translated.value;
    },
  },
  mounted(): void {
    this.$store.dispatch('activity/setLevel', 'cookies');
  },
  methods: {
    setCookies(): void {
      const cookieValue = 'do-not-change-me';
      setCookie(this.cookieName, cookieValue);
      this.dismissCookieBanner();
    },
    cancel() {
      this.dismissCookieBanner();
    },
    dismissCookieBanner(): void {
      this.fadeOutClass = 'cookie-banner__fade-out';
      this.$store.dispatch('activity/setLevel', 'portal');
      this.$store.dispatch('modal/hideAndClearModal');
    },
  },
});
</script>

<style lang="stylus">
.cookie-banner

  &__title-bar
    padding: 30px 30px 5px 30px
    display: flex
    align-items: center

  &__pane-content
    padding: 5px 30px 40px 30px
    border-bottom: 1px solid rgba(255, 255, 255, 0.16)

  &__button
    box-shadow: var(--box-shadow)
    margin: 0
    font-size: var(--button-font-size)
    border-radius: var(--button-border-radius)
    background-color: var(--button-text-bgc)
    padding: 8px 30px
    line-height: 30px
    transition: background-color var(--portal-transition-duration)

  &__button-close
    margin-left: auto

  &__action-bar
    background-color: var(--color-grey0)
    display: flex
    justify-content: flex-end
    border-top: thin solid var(--color-grey8)
    padding: 8px 24px

  &__fade-out
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s .3s, opacity .5s linear;

  &__blackout
    position: fixed
    top: 0
    left: 0
    z-index: $zindex-9
    background: #5a5a5a
    opacity: 0.5
    min-height: 100vh
    width: 100vw

  &__blackout-content
    display: block

  &__text
    > a
      color: var(--color-white);
</style>
