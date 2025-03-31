<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <div
    v-if="isLoggedIn"
    class="user-icon"
  >
    <img
      v-if="image"
      :src="imageToBase64String"
      alt="profile_image"
      class="user-icon__image"
    >
    <span
      v-else
      class="user-icon__username"
    >
      <b>{{ userNameAbbreviation }}</b>
    </span>
  </div>
  <portal-icon
    v-else
    icon="menu"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { getImageType } from '@/views/selfservice/helper';
import PortalIcon from '@/components/globals/PortalIcon.vue';

interface Data {
  image: string;
}

export default defineComponent({
  name: 'HeaderMenuIcon',
  components: {
    PortalIcon,
  },
  data(): Data {
    return {
      image: '',
    };
  },
  computed: {
    ...mapGetters({
      userState: 'user/userState',
      isLoggedIn: 'user/isLoggedIn',
    }),
    userNameAbbreviation(): string {
      const { firstname, lastname, displayName, username } = this.userState;
      if (firstname && lastname) {
        return firstname.charAt(0) + lastname.charAt(0);
      }
      if (displayName) {
        return displayName.charAt(0);
      }
      if (username) {
        return username.charAt(0);
      }
      return '';
    },
    imageToBase64String(): string {
      if (!this.image.startsWith('data:')) {
        return `data:image/${getImageType(this.image)};base64,${this.image}`;
      }
      return this.image;
    },
  },
  watch: {
    userState: {
      deep: true,
      handler() {
        this.loadProfileImage();
      },
    },
  },
  mounted() {
    this.loadProfileImage();
  },
  methods: {
    loadProfileImage() {
      if (this.userState?.jpegPhoto) {
        this.image = this.userState.jpegPhoto;
      }
    },
  },
});
</script>

<style lang="stylus">
.user-icon
  width: 2rem
  height: 2rem
  display: flex
  align-items: center
  justify-content: center
  flex-shrink: 0
  border-radius: 50%
  outline: 1px solid var(--font-color-contrast-high)
  background: var(--bgc-announcements-info)
  overflow: hidden

  &__username
    color: var(--font-color-contrast-high)
    font-size: var(--font-size-5)
    text-transform: uppercase

  &__image
    width: 100%
</style>
