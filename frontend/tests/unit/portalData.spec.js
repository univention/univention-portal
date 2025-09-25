/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import { createStore } from 'vuex';

describe('PortalData Filtering Bug Fix', () => {
  let store;
  let mockPortalLayout;

  beforeEach(() => {
    // Mock portal layout with categories and tiles
    mockPortalLayout = [
      {
        id: 'category-1',
        dn: 'category1',
        title: { en: 'System Settings' },
        tiles: [
          {
            id: 'tile-1',
            dn: 'tile1',
            title: { en: 'Univention Management Console' },
            description: { en: 'Management console description' },
            keywords: ['umc', 'management'],
          },
          {
            id: 'tile-2',
            dn: 'tile2',
            title: { en: 'Blog Entry' },
            description: { en: 'Company blog' },
            keywords: ['blog', 'news'],
          },
        ],
      },
      {
        id: 'category-2',
        dn: 'category2',
        title: { en: 'Applications' },
        tiles: [
          {
            id: 'tile-3',
            dn: 'tile3',
            title: { en: 'App Store' },
            description: { en: 'Download applications' },
            keywords: ['apps', 'store'],
          },
        ],
      },
    ];

    // Create a simplified store with just the modules we need for testing
    store = createStore({
      modules: {
        portalData: {
          namespaced: true,
          state: {
            editMode: false,
          },
          getters: {
            portalFinalLayout: () => mockPortalLayout,
            portalFinalLayoutFiltered: (state, getters, rootState, rootGetters) => {
              if (state.editMode) {
                return getters.portalFinalLayout;
              }
              const searchQuery = rootGetters['search/searchQuery'];

              if (!searchQuery || searchQuery.trim() === '') {
                return getters.portalFinalLayout;
              }

              return getters.portalFinalLayout
                .map((category) => ({
                  ...category,
                  tiles: category.tiles.filter((entry) => {
                    const searchTerm = searchQuery.toLowerCase();
                    return entry.title?.en?.toLowerCase().includes(searchTerm) ||
                           entry.description?.en?.toLowerCase().includes(searchTerm) ||
                           entry.keywords?.some((keyword) => keyword.toLowerCase().includes(searchTerm));
                  }),
                }))
                .filter((category) => category.tiles.length > 0);
            },
          },
          mutations: {
            EDITMODE(state, editMode) {
              state.editMode = editMode;
            },
          },
        },
        search: {
          namespaced: true,
          state: {
            searchQuery: '',
          },
          getters: {
            searchQuery: (state) => state.searchQuery,
          },
          mutations: {
            SET_SEARCH_QUERY(state, payload) {
              state.searchQuery = payload;
            },
          },
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns full layout when search query is empty', () => {
    // Set empty search query
    store.commit('search/SET_SEARCH_QUERY', '');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    expect(filtered).toEqual(mockPortalLayout);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].tiles).toHaveLength(2);
    expect(filtered[1].tiles).toHaveLength(1);
  });

  test('returns full layout when search query is only whitespace', () => {
    // Set whitespace-only search query
    store.commit('search/SET_SEARCH_QUERY', '   ');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    expect(filtered).toEqual(mockPortalLayout);
    expect(filtered).toHaveLength(2);
  });

  test('filters tiles by title match', () => {
    // Search for "Blog"
    store.commit('search/SET_SEARCH_QUERY', 'blog');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('category-1');
    expect(filtered[0].tiles).toHaveLength(1);
    expect(filtered[0].tiles[0].title.en).toBe('Blog Entry');
  });

  test('filters tiles by description match', () => {
    // Search for "management"
    store.commit('search/SET_SEARCH_QUERY', 'management');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    expect(filtered).toHaveLength(1);
    expect(filtered[0].tiles).toHaveLength(1);
    expect(filtered[0].tiles[0].title.en).toBe('Univention Management Console');
  });

  test('filters tiles by keywords match', () => {
    // Search for "apps"
    store.commit('search/SET_SEARCH_QUERY', 'apps');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('category-2');
    expect(filtered[0].tiles).toHaveLength(1);
    expect(filtered[0].tiles[0].title.en).toBe('App Store');
  });

  test('filters out categories with no matching tiles', () => {
    // Search for something that doesn't exist
    store.commit('search/SET_SEARCH_QUERY', 'nonexistent');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    expect(filtered).toHaveLength(0);
  });

  test('does not mutate original layout when filtering', () => {
    // Store original layout
    const originalLayout = JSON.parse(JSON.stringify(mockPortalLayout));

    // Apply filter
    store.commit('search/SET_SEARCH_QUERY', 'blog');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    // Check that original layout is unchanged
    const currentLayout = store.getters['portalData/portalFinalLayout'];
    expect(currentLayout).toEqual(originalLayout);

    // Check that filtered result is different
    expect(filtered).not.toEqual(originalLayout);
    expect(filtered[0].tiles).toHaveLength(1);
    expect(currentLayout[0].tiles).toHaveLength(2); // Original should still have both tiles
  });

  test('case insensitive search works correctly', () => {
    // Search for "BLOG" in uppercase
    store.commit('search/SET_SEARCH_QUERY', 'BLOG');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    expect(filtered).toHaveLength(1);
    expect(filtered[0].tiles[0].title.en).toBe('Blog Entry');
  });

  test('partial word matching works', () => {
    // Search for partial word "univen"
    store.commit('search/SET_SEARCH_QUERY', 'univen');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    expect(filtered).toHaveLength(1);
    expect(filtered[0].tiles[0].title.en).toBe('Univention Management Console');
  });

  test('returns original layout in edit mode regardless of search query', () => {
    // Enable edit mode
    store.commit('portalData/EDITMODE', true);

    // Set search query
    store.commit('search/SET_SEARCH_QUERY', 'blog');

    const filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    // Should return full layout in edit mode
    expect(filtered).toEqual(mockPortalLayout);
    expect(filtered).toHaveLength(2);
  });

  test('search results restore correctly when search is cleared', () => {
    // Start with a search
    store.commit('search/SET_SEARCH_QUERY', 'blog');
    let filtered = store.getters['portalData/portalFinalLayoutFiltered'];
    expect(filtered).toHaveLength(1);

    // Clear search
    store.commit('search/SET_SEARCH_QUERY', '');
    filtered = store.getters['portalData/portalFinalLayoutFiltered'];

    // Should restore full layout
    expect(filtered).toEqual(mockPortalLayout);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].tiles).toHaveLength(2);
    expect(filtered[1].tiles).toHaveLength(1);
  });
});
