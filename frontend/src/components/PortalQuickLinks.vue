<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <div
    v-if="portalQuickLinks().length > 0"
    class="portal-quick-links"
  >
    <portal-quick-draft
      v-for="(item, index) in portalQuickLinks()"
      :key="index"
      :title="item.name"
      :entries="item.entries"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import PortalQuickDraft, { PortalQuickDraftEntry } from './PortalQuickDraft.vue';

type PortalQuickLinks = Array<{
  name: string;
  entries: Array<PortalQuickDraftEntry>
}>;

export default defineComponent({
  name: 'PortalQuickLinks',
  components: {
    PortalQuickDraft,
  },
  computed: {
    ...mapGetters({
      quickLinks: 'portalData/quickLinks',
      portalFolders: 'portalData/portalFolders',
      portalEntries: 'portalData/portalEntries',
    }),
  },
  methods: {
    getEntries(dn: string) {
      // eslint-disable-next-line camelcase
      const entries: Array<PortalQuickDraftEntry> = this.portalEntries?.filter((e) => e.dn === dn).map(({ name, description, links, icon_url, linkTarget }) => ({
        name: this.$localized(name),
        description: this.$localized(description),
        link: this.$localized(links.reduce((acc, link) => {
          acc[link.locale] = link.value;
          return acc;
        }, {})),
        iconUrl: icon_url,
        linkTarget: linkTarget === 'newwindow' ? '_blank' : '_self',
      }));
      return entries;
    },
    portalQuickLinks() {
      const folders: PortalQuickLinks = this.quickLinks?.flatMap((dn) => this.portalFolders?.filter((folder) => folder.dn === dn)
        .map(({ name, entries }) => ({
          name: this.$localized(name),
          entries: entries.flatMap((entryDn) => this.getEntries(entryDn)),
        }),
        ));
      const entries: PortalQuickLinks = this.quickLinks?.flatMap((dn) => this.getEntries(dn)).map((e) => ({
        name: e.name,
        entries: [e],
      }));
      return folders.concat(entries);
    },
  },
});
</script>

<style lang="stylus">
.portal-quick-links
  display: grid
  gap: calc(2 * var(--layout-spacing-unit))
  grid-template-columns: repeat(2, 1fr)
  grid-template-rows: 1fr
  margin: calc(6 * var(--layout-spacing-unit)) 0
</style>
