/*
 * @fileName:
 * @Date: 2021-03-04 11:51:44
 * @Author: manyao.zhu
 */
import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import(/*webpackChunkName:'login_register'*/'@/views/Index/home')

Vue.use(Router)

export default new Router({
	linkActiveClass: 'active-header',
	mode: 'history',
	routes: [
    {
      path:'/home',
      name: 'home',
      component: Home
    },{
      path: '*',
        redirect: {
          name: 'home',
          component: Home
        }
    }
	],
	scrollBehavior (to, from, savedPosition) {
	    return { x: 0, y: 0 }
	}
})
