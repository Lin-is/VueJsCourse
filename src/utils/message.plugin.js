/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
export default {
  install(Vue, options) {
    Vue.prototype.$message = (html) => {
      M.toast({ html });
    };
    Vue.prototype.$error = (html) => {
      M.toast({ html: `[Ошибка]: ${html}` });
    };
    console.log(options);
  },
};
