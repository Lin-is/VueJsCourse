import Vue from 'vue';
import dateFilter from '@/filters/date.filter';
import currencyFilter from '@/filters/currency.filter';
import tooltipDirective from '@/directives/tooltip.directive';
import messagePlugin from '@/utils/message.plugin';
import Loader from '@/components/app/Loader.vue';
import Vuelidate from 'vuelidate';
import Paginate from 'vuejs-paginate';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import 'materialize-css/dist/js/materialize.min';

Vue.config.productionTip = false;
Vue.filter('date', dateFilter);
Vue.filter('currency', currencyFilter);
Vue.directive('tooltip', tooltipDirective);
Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.component('Loader', Loader);
Vue.component('Paginate', Paginate);

const firebaseConfig = {
  apiKey: 'AIzaSyBc7EWutoM1R6pHO8PZsgQEI2-6fcCvA4o',
  authDomain: 'vue-course-51c0f.firebaseapp.com',
  databaseURL: 'https://vue-course-51c0f.firebaseio.com',
  projectId: 'vue-course-51c0f',
  storageBucket: 'vue-course-51c0f.appspot.com',
  messagingSenderId: '478854445685',
  appId: '1:478854445685:web:1109ee9c677e19ff32163c',
};

firebase.initializeApp(firebaseConfig);

let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
