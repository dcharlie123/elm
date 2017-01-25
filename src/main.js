import './common/style/index.css';

import App from './App.vue';
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import goods from 'components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

Vue.use(VueRouter);
Vue.use(VueResource);
/* eslint-disable no-new */
let app=Vue.extend(App);//挂载在App
let router=new VueRouter({
  linkActiveClass:'active'
});

router.map({
  '/goods':{
    component:goods
  },
  '/ratings':{
    component:ratings
  },
  '/seller':{
    component:seller
  }
});
router.redirect({
	'/':'/goods'
});
router.start(app,'#app');


