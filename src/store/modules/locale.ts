import { updateLocale } from '@/i18n/translations';
import { Locale } from '../models';
import { PortalModule } from '../types';

export interface LocaleState {
  locale: Locale;
}

const locale: PortalModule<LocaleState> = {
  namespaced: true,
  state: {
    locale: 'en_US',
  },

  mutations: {
    NEWLOCALE(state, payload) {
      state.locale = payload.locale;
    },
  },

  getters: {
    getLocale: (state) => state.locale,
  },

  actions: {
    setLocale({ commit }, payload) {
      commit('NEWLOCALE', payload);
      return updateLocale(payload.locale);
    },
  },
};

export default locale;
