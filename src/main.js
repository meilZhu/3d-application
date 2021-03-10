/*
 * @fileName:
 * @Date: 2021-03-04 11:51:43
 * @Author: manyao.zhu
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import './assets/css/base.css'
import router from './router'

Vue.use(ElementUI);


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
	router,
  components: { App },
  template: '<App/>'
})
