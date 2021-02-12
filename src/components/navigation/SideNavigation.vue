<template>
  <nav class="portal-sidenavigation">
    <div class="portal-sidenavigation__login-header">
      <div
        v-if="userData && userData.username"
        class="portal-sidenavigation__user-row"
      >
        <portal-icon
          icon="user"
          icon-width="6rem"
        />
        <div>
          <div class="portal-sidenavigation--username">
            {{ userData.username }}
          </div>
          <div
            class="portal-sidenavigation__logout-link"
            @click="logout"
          >
            {{ logoutLabel }}
          </div>
        </div>
      </div>
      <div
        v-else
        class="portal-sidenavigation__link"
        @click="login"
      >
        {{ loginLabel }}
      </div>
    </div>
    <ul class="portal-sidenavigation__menu">
      <li
        @click="switchLocale"
      >
        Switch locale
      </li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
    </ul>
    <div
      v-if="isAdmin"
      class="portal-sidenavigation__link portal-sidenavigation__edit-mode"
    >
      {{ editPortalLabel }}
    </div>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import PortalIcon from '@/components/globals/PortalIcon.vue';
import userMixin from '@/mixins/userMixin.vue';
import _ from '@/jsHelper/i18n.js';

@Options({
  name: 'SideNavigation',
  components: {
    PortalIcon,
  },
  mixins: [userMixin],
  computed: {
    loginLabel() {
      return _('Login').value;
    },
    logoutLabel() {
      return _('Logout').value;
    },
    editPortalLabel() {
      return _('Edit portal').value;
    },
  },
  methods: {
    switchLocale() {
      if (this.$store.state.locale.locale === 'en_US') {
        this.$store.dispatch('locale/setLocale', { locale: 'de_DE' });
      } else {
        this.$store.dispatch('locale/setLocale', { locale: 'en_US' });
      }
    },
  },
})

export default class SideNavigation extends Vue {}
</script>

<style lang="stylus">
.portal-sidenavigation
  height: calc(100vh - (var(--portal-header-height) + 0.5rem))
  display: flex
  flex-direction: column
  align-item: flex-end

  &__link
    padding: 1em 0 1em 20px
    cursor: pointer
    height: auto
    justify-content: left
    font-size: var(--font-size-normal)
    color: var(--font-color-contrast-high)
    font-weight: 600
    text-transform: uppercase
    &:hover
      background-color: #272726

  &__user-row
    display: flex

    svg
      fill: currentColor
      background-color: var(--color-grey40)
      margin: 0.5rem
      border-radius: 50%
    &> div
      margin: auto 0

  &__logout-link
    text-decoration: underline
    cursor: pointer
    &:hover
      background-color: #272726

  &__login-header
    border-bottom: 4px solid var(--color-grey8)

  &__menu
    margin-bottom: auto

  &__edit-mode
    border-top: 4px solid var(--color-grey8)
</style>
