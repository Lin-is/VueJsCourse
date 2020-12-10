/* eslint-disable no-param-reassign */
import localizeFilter from '@/filters/localize.filter';

export default {
  install(Vue) {
    // eslint-disable-next-line func-names
    Vue.prototype.$title = function (titleKey) {
      const appName = process.env.VUE_APP_TITLE;
      return `${localizeFilter(titleKey)} | ${appName}`;
    };
  },
};
