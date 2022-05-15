import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import RandomList from './component/RandomList';
import axios from 'axios';
import { Lazyload, Popup, Swipe, SwipeItem, Slider, Icon, Dialog } from 'vant';

Vue.use(Lazyload, { lazyComponent: true })
Vue.use(Popup)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Slider)
Vue.use(Icon)
Vue.use(Dialog)

Vue.prototype.$axios = axios

Vue.use(VueRouter)

const routes = [
  { path: '/random', component: RandomList }
  // { path: '/bar', component: Bar }
]

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// Vue.prototype.$router = router

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
